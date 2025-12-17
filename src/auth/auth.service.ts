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
     *
     * SECURITY: Retourne toujours le même message pour éviter l'énumération d'utilisateurs (OWASP)
     */
    async resendVerificationEmail(email: string): Promise<{ message: string }> {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        // SECURITY: Ne pas révéler si l'email existe ou non
        // Toujours retourner le même message de succès
        const genericMessage = 'Si un compte avec cet email existe et n\'est pas encore vérifié, un email de vérification a été envoyé.';

        // Si l'utilisateur n'existe pas, retourner le message générique sans erreur
        if (!user) {
            this.logger.warn(`Tentative de renvoie d'email pour un compte inexistant: ${email}`);
            return { message: genericMessage };
        }

        // Si l'email est déjà vérifié, retourner le message générique sans erreur
        if (user.emailVerified) {
            this.logger.warn(`Tentative de renvoie d'email pour un compte déjà vérifié: ${email}`);
            return { message: genericMessage };
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

        // Envoyer l'email (ne pas throw d'erreur si échec pour éviter l'énumération)
        try {
            await this.mailService.sendVerificationEmail(
                user.email,
                user.username,
                verificationToken,
            );
            this.logger.log(`Email de vérification renvoyé à: ${email}`);
        } catch (error) {
            this.logger.error(
                `Erreur lors de l'envoi de l'email de vérification à ${email}: ${error.message}`,
            );
            // SECURITY: Ne pas révéler l'erreur d'envoi, retourner le message générique
        }

        return { message: genericMessage };
    }

    /**
     * Connexion
     *
     * SECURITY: Utilise le même message d'erreur pour tous les cas (OWASP - Prevent User Enumeration)
     */
    async login(dto: LoginDto): Promise<LoginResponseDto> {
        // Trouver l'utilisateur par username ou email
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [{ username: dto.usernameOrEmail }, { email: dto.usernameOrEmail }],
                deletedAt: null,
            },
        });

        // SECURITY: Toujours utiliser le même message d'erreur générique
        const genericErrorMessage = 'Identifiants incorrects';

        if (!user) {
            // SECURITY: Toujours faire un hash bcrypt même si l'utilisateur n'existe pas
            // Cela empêche les timing attacks qui pourraient révéler si un utilisateur existe
            await bcrypt.compare('dummy-password', '$2b$10$dummyHashToPreventTimingAttacks1234567890123456789012');
            throw new UnauthorizedException(genericErrorMessage);
        }

        // Vérifier que l'utilisateur a un mot de passe (compte activé)
        if (!user.passwordHash) {
            throw new UnauthorizedException('Compte non activé. Veuillez vérifier votre email.');
        }

        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(
            dto.password,
            user.passwordHash,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException(genericErrorMessage);
        }

        // SECURITY: Vérifier que le compte est actif APRÈS la vérification du mot de passe
        // pour ne pas révéler qu'un compte existe mais n'est pas actif
        if (!user.isActive) {
            throw new UnauthorizedException(genericErrorMessage);
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
     * Activer un compte avec un token et définir le mot de passe
     */
    async activateAccount(token: string, password: string): Promise<LoginResponseDto> {
        // Trouver le token d'activation
        const activationToken = await this.prisma.accountActivationToken.findUnique({
            where: { token },
            include: {
                user: true,
            },
        });

        if (!activationToken) {
            throw new NotFoundException('Token d\'activation invalide ou expiré');
        }

        // Vérifier que le token n'a pas déjà été utilisé
        if (activationToken.usedAt) {
            throw new BadRequestException('Ce token d\'activation a déjà été utilisé');
        }

        // Vérifier que le token n'a pas expiré
        if (new Date() > activationToken.expiresAt) {
            throw new BadRequestException('Ce token d\'activation a expiré');
        }

        // Vérifier que l'utilisateur existe
        if (!activationToken.user) {
            throw new NotFoundException('Utilisateur non trouvé');
        }

        // Hasher le mot de passe
        const saltRounds = this.configService.get<number>('BCRYPT_ROUNDS', 10);
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Mettre à jour l'utilisateur et marquer le token comme utilisé
        const user = await this.prisma.$transaction(async (tx) => {
            // Activer le compte et définir le mot de passe
            const updatedUser = await tx.user.update({
                where: { id: activationToken.userId! },
                data: {
                    passwordHash,
                    isActive: true,
                    emailVerified: true,
                    emailVerifiedAt: new Date(),
                },
            });

            // Marquer le token comme utilisé
            await tx.accountActivationToken.update({
                where: { id: activationToken.id },
                data: { usedAt: new Date() },
            });

            return updatedUser;
        });

        this.logger.log(`Compte activé avec succès pour l'utilisateur: ${user.username}`);

        // Générer un JWT pour connexion automatique
        const expiresIn = this.configService.get<number>('JWT_EXPIRATION_SECONDS', 604800);
        const payload = {
            sub: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        };

        const accessToken = this.jwtService.sign(payload);

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
