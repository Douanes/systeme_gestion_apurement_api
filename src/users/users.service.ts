import {
    Injectable,
    ConflictException,
    NotFoundException,
    ForbiddenException,
    BadRequestException,
    Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import {
    CreateSystemUserDto,
    CreateTransitStaffDto,
    UpdateUserDto,
    UserFilterDto,
    UserResponseDto,
    PaginatedUsersResponseDto,
} from 'libs/dto/users';
import { UserRole } from 'libs/dto/auth';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly mailService: MailService,
        private readonly configService: ConfigService,
    ) { }

    /**
     * Créer un utilisateur système (ADMIN ou SUPERVISEUR)
     * Seuls les ADMIN peuvent créer des ADMIN ou SUPERVISEUR
     */
    async createSystemUser(
        dto: CreateSystemUserDto,
        currentUserId: number,
    ): Promise<UserResponseDto> {
        // Vérifier que l'utilisateur actuel est ADMIN
        const currentUser = await this.prisma.user.findUnique({
            where: { id: currentUserId },
        });

        if (!currentUser || currentUser.role !== UserRole.ADMIN) {
            throw new ForbiddenException(
                'Seuls les administrateurs peuvent créer des utilisateurs système',
            );
        }

        // Vérifier que le rôle demandé est bien ADMIN ou SUPERVISEUR
        if (dto.role !== UserRole.ADMIN && dto.role !== UserRole.SUPERVISEUR) {
            throw new BadRequestException(
                'Ce endpoint ne peut créer que des ADMIN ou SUPERVISEUR',
            );
        }

        // Vérifier que l'email n'existe pas
        const existingEmail = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (existingEmail) {
            throw new ConflictException('Un compte avec cet email existe déjà');
        }

        // Vérifier que le username n'existe pas
        const existingUsername = await this.prisma.user.findUnique({
            where: { username: dto.username },
        });

        if (existingUsername) {
            throw new ConflictException('Ce nom d\'utilisateur est déjà pris');
        }

        // Hasher le mot de passe
        const saltRounds = this.configService.get<number>('BCRYPT_ROUNDS', 10);
        const passwordHash = await bcrypt.hash(dto.password, saltRounds);

        // Créer l'utilisateur (compte activé et email vérifié par défaut pour les admins)
        const user = await this.prisma.user.create({
            data: {
                username: dto.username,
                email: dto.email,
                passwordHash,
                firstname: dto.firstname,
                lastname: dto.lastname,
                phone: dto.phone,
                role: dto.role,
                isActive: true,
                emailVerified: true,
                emailVerifiedAt: new Date(),
            },
        });

        this.logger.log(
            `Utilisateur système créé: ${user.username} (${user.role}) par ${currentUser.username}`,
        );

        return this.toResponseDto(user);
    }

    /**
     * Inviter un staff à rejoindre une maison de transit (token-based invitation)
     * Seuls les ADMIN ou le responsable de la maison de transit peuvent inviter
     */
    async inviteStaff(
        maisonTransitId: number,
        email: string,
        staffRole: string,
        currentUserId: number,
    ): Promise<{ message: string; invitationToken: string }> {
        const currentUser = await this.prisma.user.findUnique({
            where: { id: currentUserId },
        });

        if (!currentUser) {
            throw new NotFoundException('Utilisateur actuel non trouvé');
        }

        // Vérifier que la maison de transit existe
        const maisonTransit = await this.prisma.maisonTransit.findUnique({
            where: { id: maisonTransitId },
        });

        if (!maisonTransit) {
            throw new NotFoundException('Maison de transit non trouvée');
        }

        // Vérifier les permissions
        if (
            currentUser.role !== UserRole.ADMIN &&
            maisonTransit.responsableId !== currentUserId
        ) {
            throw new ForbiddenException(
                'Vous n\'avez pas la permission d\'inviter du staff à cette maison de transit',
            );
        }

        // Vérifier que l'email n'existe pas déjà
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new ConflictException(
                'Un compte avec cet email existe déjà. L\'utilisateur doit se connecter ou utiliser un autre email.',
            );
        }

        // Générer le token d'invitation (valide 7 jours)
        const invitationToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        // Créer le token d'invitation
        await this.prisma.accountActivationToken.create({
            data: {
                email,
                token: invitationToken,
                type: 'MT_INVITATION',
                expiresAt,
                maisonTransitId,
                invitedBy: currentUserId,
                staffRole: staffRole || 'STAFF',
            },
        });

        // Envoyer l'email d'invitation
        try {
            await this.mailService.sendMaisonTransitInvitationEmail(
                email,
                maisonTransit.name,
                `${currentUser.firstname} ${currentUser.lastname}`,
                invitationToken,
                staffRole || 'STAFF',
            );
            this.logger.log(
                `Invitation envoyée à ${email} pour rejoindre MT ${maisonTransit.name} par ${currentUser.username}`,
            );
        } catch (error) {
            this.logger.error(
                `Erreur lors de l'envoi de l'email d'invitation: ${error.message}`,
            );
        }

        return {
            message: 'Invitation envoyée avec succès',
            invitationToken, // Retourné pour debug/testing
        };
    }

    /**
     * Créer un staff de maison de transit
     * Seuls les ADMIN ou le responsable de la maison de transit peuvent ajouter du staff
     */
    async createTransitStaff(
        dto: CreateTransitStaffDto,
        currentUserId: number,
    ): Promise<UserResponseDto> {
        const currentUser = await this.prisma.user.findUnique({
            where: { id: currentUserId },
        });

        if (!currentUser) {
            throw new NotFoundException('Utilisateur actuel non trouvé');
        }

        // Vérifier que la maison de transit existe
        const maisonTransit = await this.prisma.maisonTransit.findUnique({
            where: { id: dto.maisonTransitId },
        });

        if (!maisonTransit) {
            throw new NotFoundException('Maison de transit non trouvée');
        }

        // Vérifier les permissions
        if (
            currentUser.role !== UserRole.ADMIN &&
            maisonTransit.responsableId !== currentUserId
        ) {
            throw new ForbiddenException(
                'Vous n\'avez pas la permission d\'ajouter du staff à cette maison de transit',
            );
        }

        // Vérifier que l'email n'existe pas
        const existingEmail = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (existingEmail) {
            throw new ConflictException('Un compte avec cet email existe déjà');
        }

        // Vérifier que le username n'existe pas
        const existingUsername = await this.prisma.user.findUnique({
            where: { username: dto.username },
        });

        if (existingUsername) {
            throw new ConflictException('Ce nom d\'utilisateur est déjà pris');
        }

        // Hasher le mot de passe
        const saltRounds = this.configService.get<number>('BCRYPT_ROUNDS', 10);
        const passwordHash = await bcrypt.hash(dto.password, saltRounds);

        // Créer l'utilisateur et l'association avec la maison de transit dans une transaction
        const result = await this.prisma.$transaction(async (tx) => {
            // Créer l'utilisateur
            const user = await tx.user.create({
                data: {
                    username: dto.username,
                    email: dto.email,
                    passwordHash,
                    firstname: dto.firstname,
                    lastname: dto.lastname,
                    phone: dto.phone,
                    role: UserRole.TRANSITAIRE,
                    isActive: false, // Doit vérifier son email
                    emailVerified: false,
                },
            });

            // Créer l'association avec la maison de transit
            await tx.userMaisonTransit.create({
                data: {
                    userId: user.id,
                    maisonTransitId: dto.maisonTransitId,
                    role: dto.maisonTransitRole || 'STAFF',
                    assignedBy: currentUserId,
                },
            });

            // Générer un token de vérification
            const verificationToken = this.generateVerificationToken();
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 24);

            await tx.emailVerification.create({
                data: {
                    userId: user.id,
                    token: verificationToken,
                    expiresAt,
                },
            });

            return { user, verificationToken };
        });

        // Envoyer l'email de vérification
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
        }

        this.logger.log(
            `Staff créé pour MT ${dto.maisonTransitId}: ${result.user.username} par ${currentUser.username}`,
        );

        return this.toResponseDto(result.user);
    }

    /**
     * Lister les utilisateurs avec filtres et pagination
     */
    async findAll(filters: UserFilterDto): Promise<PaginatedUsersResponseDto> {
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const skip = (page - 1) * limit;

        // Construire le where dynamiquement
        const where: any = {
            deletedAt: null,
        };

        if (filters.role) {
            where.role = filters.role;
        }

        if (filters.isActive !== undefined) {
            where.isActive = filters.isActive;
        }

        if (filters.emailVerified !== undefined) {
            where.emailVerified = filters.emailVerified;
        }

        if (filters.search) {
            where.OR = [
                { firstname: { contains: filters.search, mode: 'insensitive' } },
                { lastname: { contains: filters.search, mode: 'insensitive' } },
                { username: { contains: filters.search, mode: 'insensitive' } },
                { email: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        if (filters.maisonTransitId) {
            where.maisonTransits = {
                some: {
                    maisonTransitId: filters.maisonTransitId,
                    deletedAt: null,
                },
            };
        }

        // Compter le total
        const total = await this.prisma.user.count({ where });

        // Récupérer les utilisateurs
        const users = await this.prisma.user.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });

        return {
            data: users.map((user) => this.toResponseDto(user)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    /**
     * Récupérer un utilisateur par ID
     */
    async findOne(id: number): Promise<UserResponseDto> {
        const user = await this.prisma.user.findUnique({
            where: { id, deletedAt: null },
        });

        if (!user) {
            throw new NotFoundException('Utilisateur non trouvé');
        }

        return this.toResponseDto(user);
    }

    /**
     * Mettre à jour un utilisateur
     */
    async update(
        id: number,
        dto: UpdateUserDto,
        currentUserId: number,
    ): Promise<UserResponseDto> {
        const currentUser = await this.prisma.user.findUnique({
            where: { id: currentUserId },
        });

        if (!currentUser) {
            throw new NotFoundException('Utilisateur actuel non trouvé');
        }

        const userToUpdate = await this.prisma.user.findUnique({
            where: { id, deletedAt: null },
        });

        if (!userToUpdate) {
            throw new NotFoundException('Utilisateur non trouvé');
        }

        // Vérifier les permissions
        // Un utilisateur peut se modifier lui-même
        // Un ADMIN peut modifier n'importe qui
        if (currentUserId !== id && currentUser.role !== UserRole.ADMIN) {
            throw new ForbiddenException(
                'Vous n\'avez pas la permission de modifier cet utilisateur',
            );
        }

        // Vérifier l'unicité de l'email si modifié
        if (dto.email && dto.email !== userToUpdate.email) {
            const existingEmail = await this.prisma.user.findUnique({
                where: { email: dto.email },
            });

            if (existingEmail) {
                throw new ConflictException('Cet email est déjà utilisé');
            }
        }

        // Vérifier l'unicité du username si modifié
        if (dto.username && dto.username !== userToUpdate.username) {
            const existingUsername = await this.prisma.user.findUnique({
                where: { username: dto.username },
            });

            if (existingUsername) {
                throw new ConflictException('Ce nom d\'utilisateur est déjà pris');
            }
        }

        // Mettre à jour
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: dto,
        });

        this.logger.log(`Utilisateur ${id} mis à jour par ${currentUser.username}`);

        return this.toResponseDto(updatedUser);
    }

    /**
     * Supprimer un utilisateur (soft delete)
     */
    async remove(id: number, currentUserId: number): Promise<{ message: string }> {
        const currentUser = await this.prisma.user.findUnique({
            where: { id: currentUserId },
        });

        if (!currentUser) {
            throw new NotFoundException('Utilisateur actuel non trouvé');
        }

        // Seuls les ADMIN peuvent supprimer des utilisateurs
        if (currentUser.role !== UserRole.ADMIN) {
            throw new ForbiddenException(
                'Seuls les administrateurs peuvent supprimer des utilisateurs',
            );
        }

        const userToDelete = await this.prisma.user.findUnique({
            where: { id, deletedAt: null },
        });

        if (!userToDelete) {
            throw new NotFoundException('Utilisateur non trouvé');
        }

        // Soft delete
        await this.prisma.user.update({
            where: { id },
            data: { deletedAt: new Date() },
        });

        this.logger.log(`Utilisateur ${id} supprimé par ${currentUser.username}`);

        return {
            message: 'Utilisateur supprimé avec succès',
        };
    }

    /**
     * Convertir un User Prisma en UserResponseDto
     */
    private toResponseDto(user: any): UserResponseDto {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            phone: user.phone,
            role: user.role,
            isActive: user.isActive,
            emailVerified: user.emailVerified,
            emailVerifiedAt: user.emailVerifiedAt,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

    /**
     * Générer un token de vérification aléatoire
     */
    private generateVerificationToken(): string {
        return crypto.randomBytes(32).toString('hex');
    }
}
