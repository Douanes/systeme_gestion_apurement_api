import {
    Injectable,
    ConflictException,
    UnauthorizedException,
    NotFoundException,
    BadRequestException,
    Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {
    RegisterTransitHouseDto,
    LoginDto,
    LoginResponseDto,
    RegisterResponseDto,
    VerifyEmailResponseDto,
    UserRole,
} from 'libs/dto/auth';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly mailService: MailService,
    ) { }

    /**
     * Inscription d'une maison de transit
     */
    async registerTransitHouse(
        dto: RegisterTransitHouseDto,
    ): Promise<RegisterResponseDto> {
        // Vérifier que l'email n'existe pas déjà
        const existingEmail = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (existingEmail) {
            throw new ConflictException('Un compte avec cet email existe déjà');
        }

        // Vérifier que le username n'existe pas déjà
        const existingUsername = await this.prisma.user.findUnique({
            where: { username: dto.username },
        });

        if (existingUsername) {
            throw new ConflictException('Ce nom d\'utilisateur est déjà pris');
        }

        // Vérifier que le code de maison transit n'existe pas déjà
        const existingCode = await this.prisma.maisonTransit.findUnique({
            where: { code: dto.maisonTransitCode },
        });

        if (existingCode) {
            throw new ConflictException(
                'Une maison de transit avec ce code existe déjà',
            );
        }

        // Hasher le mot de passe
        const saltRounds = this.configService.get<number>('BCRYPT_ROUNDS', 10);
        const passwordHash = await bcrypt.hash(dto.password, saltRounds);

        // Créer l'utilisateur et la maison de transit dans une transaction
        const result = await this.prisma.$transaction(async (tx) => {
            // 1. Créer l'utilisateur
            const user = await tx.user.create({
                data: {
                    username: dto.username,
                    email: dto.email,
                    passwordHash,
                    firstname: dto.firstname,
                    lastname: dto.lastname,
                    phone: dto.phone,
                    role: UserRole.TRANSITAIRE,
                    isActive: false, // Sera activé après vérification email
                    emailVerified: false,
                },
            });

            // 2. Créer la maison de transit
            const maisonTransit = await tx.maisonTransit.create({
                data: {
                    code: dto.maisonTransitCode,
                    name: dto.maisonTransitName,
                    address: dto.maisonTransitAddress,
                    phone: dto.maisonTransitPhone,
                    email: dto.maisonTransitEmail,
                    responsableId: user.id,
                },
            });

            // 3. Générer un token de vérification
            const verificationToken = this.generateVerificationToken();
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 24); // Expire dans 24h

            await tx.emailVerification.create({
                data: {
                    userId: user.id,
                    token: verificationToken,
                    expiresAt,
                },
            });

            return { user, maisonTransit, verificationToken };
        });

        // Envoyer l'email de vérification (en dehors de la transaction)
        try {
            await this.mailService.sendVerificationEmail(
                result.user.email,
                result.user.username,
                result.verificationToken,
            );
        } catch (error) {
            this.logger.error(
                `Erreur lors de l'envoi de l'email de vérification: ${error.message}`,
            );
            // Ne pas faire échouer l'inscription si l'email ne peut pas être envoyé
        }

        this.logger.log(
            `Nouvel utilisateur inscrit: ${result.user.username} (${result.user.email})`,
        );

        return {
            message:
                'Inscription réussie. Un email de vérification a été envoyé à votre adresse.',
            user: {
                id: result.user.id,
                username: result.user.username,
                email: result.user.email,
                firstname: result.user.firstname,
                lastname: result.user.lastname,
                role: result.user.role as UserRole,
            },
            maisonTransit: {
                id: result.maisonTransit.id,
                code: result.maisonTransit.code,
                name: result.maisonTransit.name,
            },
        };
    }

    /**
     * Vérifier l'email avec le token
     */
    async verifyEmail(token: string): Promise<VerifyEmailResponseDto> {
        // Trouver le token de vérification
        const verification = await this.prisma.emailVerification.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!verification) {
            throw new NotFoundException('Token de vérification invalide');
        }

        // Vérifier que le token n'a pas déjà été utilisé
        if (verification.verifiedAt) {
            throw new BadRequestException('Ce token a déjà été utilisé');
        }

        // Vérifier que le token n'a pas expiré
        if (new Date() > verification.expiresAt) {
            throw new BadRequestException(
                'Le token de vérification a expiré. Veuillez demander un nouveau lien.',
            );
        }

        // Marquer l'email comme vérifié et activer le compte
        await this.prisma.$transaction(async (tx) => {
            // Mettre à jour le token de vérification
            await tx.emailVerification.update({
                where: { id: verification.id },
                data: { verifiedAt: new Date() },
            });

            // Activer le compte utilisateur
            await tx.user.update({
                where: { id: verification.userId },
                data: {
                    emailVerified: true,
                    emailVerifiedAt: new Date(),
                    isActive: true,
                },
            });
        });

        // Envoyer l'email de bienvenue
        try {
            await this.mailService.sendWelcomeEmail(
                verification.user.email,
                verification.user.username,
            );
        } catch (error) {
            this.logger.error(
                `Erreur lors de l'envoi de l'email de bienvenue: ${error.message}`,
            );
        }

        this.logger.log(
            `Email vérifié pour l'utilisateur: ${verification.user.username}`,
        );

        return {
            message: 'Email vérifié avec succès. Votre compte est maintenant actif.',
            isActive: true,
        };
    }

    /**
     * Renvoyer l'email de vérification
     */
    async resendVerificationEmail(email: string): Promise<{ message: string }> {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new NotFoundException('Aucun compte trouvé avec cet email');
        }

        if (user.emailVerified) {
            throw new BadRequestException('Cet email est déjà vérifié');
        }

        // Supprimer les anciens tokens non utilisés
        await this.prisma.emailVerification.deleteMany({
            where: {
                userId: user.id,
                verifiedAt: null,
            },
        });

        // Créer un nouveau token
        const verificationToken = this.generateVerificationToken();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        await this.prisma.emailVerification.create({
            data: {
                userId: user.id,
                token: verificationToken,
                expiresAt,
            },
        });

        // Envoyer l'email
        try {
            await this.mailService.sendVerificationEmail(
                user.email,
                user.username,
                verificationToken,
            );
        } catch (error) {
            this.logger.error(
                `Erreur lors de l'envoi de l'email de vérification: ${error.message}`,
            );
            throw new BadRequestException(
                'Impossible d\'envoyer l\'email de vérification',
            );
        }

        return {
            message: 'Un nouvel email de vérification a été envoyé',
        };
    }

    /**
     * Connexion
     */
    async login(dto: LoginDto): Promise<LoginResponseDto> {
        // Trouver l'utilisateur par username ou email
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [{ username: dto.usernameOrEmail }, { email: dto.usernameOrEmail }],
                deletedAt: null,
            },
        });

        if (!user) {
            throw new UnauthorizedException('Identifiants incorrects');
        }

        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(
            dto.password,
            user.passwordHash,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Identifiants incorrects');
        }

        // Vérifier que le compte est actif
        if (!user.isActive) {
            throw new UnauthorizedException(
                'Votre compte n\'est pas encore activé. Veuillez vérifier votre email.',
            );
        }

        // Mettre à jour lastLogin
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
        });

        // Générer le token JWT
        const payload = {
            sub: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        };

        const accessToken = this.jwtService.sign(payload);
        const expiresIn = this.configService.get<number>('JWT_EXPIRATION', 86400);

        this.logger.log(`Utilisateur connecté: ${user.username}`);

        return {
            accessToken,
            tokenType: 'Bearer',
            expiresIn,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                role: user.role as UserRole,
                isActive: user.isActive,
                emailVerified: user.emailVerified,
            },
        };
    }

    /**
     * Générer un token de vérification aléatoire
     */
    private generateVerificationToken(): string {
        return crypto.randomBytes(32).toString('hex');
    }
}
