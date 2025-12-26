import {
    Injectable,
    NotFoundException,
    BadRequestException,
    UnauthorizedException,
    ForbiddenException,
    Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {
    UserProfileDto,
    UpdateProfileDto,
    ChangePasswordDto,
    AdminResetPasswordDto,
    ProfileSuccessDto,
} from 'libs/dto/profile';
import { UserRole } from 'libs/dto/auth';

@Injectable()
export class ProfileService {
    private readonly logger = new Logger(ProfileService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
    ) { }

    /**
     * Récupérer le profil de l'utilisateur connecté
     */
    async getProfile(userId: number): Promise<UserProfileDto> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId, deletedAt: null },
            include: {
                maisonTransits: {
                    include: {
                        maisonTransit: true,
                    },
                    where: {
                        deletedAt: null,
                    },
                },
                maisonTransitsOwned: {
                    where: {
                        deletedAt: null,
                    },
                },
            },
        });

        if (!user) {
            throw new NotFoundException('Utilisateur non trouvé');
        }

        const profile: UserProfileDto = {
            id: user.id,
            username: user.username,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            phone: user.phone || undefined,
            role: user.role as UserRole,
            isActive: user.isActive,
            emailVerified: user.emailVerified,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin || undefined,
        };

        // Si l'utilisateur est un transitaire, inclure les informations de sa maison de transit
        if (user.role === UserRole.TRANSITAIRE) {
            // Cas 1: L'utilisateur est dans la table de liaison UserMaisonTransit
            if (user.maisonTransits && user.maisonTransits.length > 0) {
                const userMT = user.maisonTransits[0];
                const mt = userMT.maisonTransit;

                profile.maisonTransit = {
                    id: mt.id,
                    code: mt.code,
                    name: mt.name,
                    address: mt.address || undefined,
                    phone: mt.phone || undefined,
                    email: mt.email || undefined,
                    userRole: userMT.role || 'MEMBRE',
                    isActive: mt.isActive,
                };
            }
            // Cas 2: L'utilisateur est responsable direct (via responsableId)
            else if (user.maisonTransitsOwned && user.maisonTransitsOwned.length > 0) {
                const mt = user.maisonTransitsOwned[0];

                profile.maisonTransit = {
                    id: mt.id,
                    code: mt.code,
                    name: mt.name,
                    address: mt.address || undefined,
                    phone: mt.phone || undefined,
                    email: mt.email || undefined,
                    userRole: 'RESPONSABLE',
                    isActive: mt.isActive,
                };
            }
        }

        return profile;
    }

    /**
     * Mettre à jour le profil de l'utilisateur
     */
    async updateProfile(
        userId: number,
        updateProfileDto: UpdateProfileDto,
    ): Promise<ProfileSuccessDto> {
        // Vérifier que l'utilisateur existe
        const user = await this.prisma.user.findUnique({
            where: { id: userId, deletedAt: null },
        });

        if (!user) {
            throw new NotFoundException('Utilisateur non trouvé');
        }

        // Mettre à jour le profil
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: {
                firstname: updateProfileDto.firstname,
                lastname: updateProfileDto.lastname,
                phone: updateProfileDto.phone,
            },
        });

        this.logger.log(`Profil mis à jour pour l'utilisateur: ${user.username}`);

        return {
            message: 'Profil mis à jour avec succès',
            user: {
                id: updatedUser.id,
                username: updatedUser.username,
                email: updatedUser.email,
                firstname: updatedUser.firstname,
                lastname: updatedUser.lastname,
                phone: updatedUser.phone || undefined,
                role: updatedUser.role as UserRole,
                isActive: updatedUser.isActive,
                emailVerified: updatedUser.emailVerified,
                createdAt: updatedUser.createdAt,
                lastLogin: updatedUser.lastLogin || undefined,
            },
        };
    }

    /**
     * Changer le mot de passe de l'utilisateur
     */
    async changePassword(
        userId: number,
        changePasswordDto: ChangePasswordDto,
    ): Promise<{ message: string }> {
        // Vérifier que les mots de passe correspondent
        if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
            throw new BadRequestException('Les nouveaux mots de passe ne correspondent pas');
        }

        // Récupérer l'utilisateur
        const user = await this.prisma.user.findUnique({
            where: { id: userId, deletedAt: null },
        });

        if (!user) {
            throw new NotFoundException('Utilisateur non trouvé');
        }

        // Vérifier le mot de passe actuel
        if (!user.passwordHash) {
            throw new BadRequestException('Aucun mot de passe défini pour ce compte');
        }

        const isPasswordValid = await bcrypt.compare(
            changePasswordDto.currentPassword,
            user.passwordHash,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Mot de passe actuel incorrect');
        }

        // Vérifier que le nouveau mot de passe est différent de l'ancien
        const isSamePassword = await bcrypt.compare(
            changePasswordDto.newPassword,
            user.passwordHash,
        );

        if (isSamePassword) {
            throw new BadRequestException(
                'Le nouveau mot de passe doit être différent de l\'ancien',
            );
        }

        // Hasher le nouveau mot de passe
        const saltRounds = parseInt(this.configService.get<string>('BCRYPT_ROUNDS', '10'), 10);
        const passwordHash = await bcrypt.hash(changePasswordDto.newPassword, saltRounds);

        // Mettre à jour le mot de passe
        await this.prisma.user.update({
            where: { id: userId },
            data: { passwordHash },
        });

        this.logger.log(`Mot de passe changé pour l'utilisateur: ${user.username}`);

        return {
            message: 'Mot de passe changé avec succès',
        };
    }

    /**
     * Réinitialiser le mot de passe d'un utilisateur (admin only)
     */
    async adminResetPassword(
        adminId: number,
        adminResetPasswordDto: AdminResetPasswordDto,
    ): Promise<{ message: string; tempPassword?: string }> {
        // Vérifier que l'admin existe et a le rôle ADMIN
        const admin = await this.prisma.user.findUnique({
            where: { id: adminId, deletedAt: null },
        });

        if (!admin || admin.role !== 'ADMIN') {
            throw new ForbiddenException('Seuls les administrateurs peuvent réinitialiser les mots de passe');
        }

        // Vérifier que l'utilisateur cible existe
        const targetUser = await this.prisma.user.findUnique({
            where: { id: adminResetPasswordDto.userId, deletedAt: null },
        });

        if (!targetUser) {
            throw new NotFoundException('Utilisateur cible non trouvé');
        }

        // Générer un mot de passe temporaire si non fourni
        const tempPassword = adminResetPasswordDto.newPassword || this.generateTempPassword();

        // Hasher le nouveau mot de passe
        const saltRounds = parseInt(this.configService.get<string>('BCRYPT_ROUNDS', '10'), 10);
        const passwordHash = await bcrypt.hash(tempPassword, saltRounds);

        // Mettre à jour le mot de passe
        await this.prisma.user.update({
            where: { id: targetUser.id },
            data: { passwordHash },
        });

        this.logger.log(
            `Mot de passe réinitialisé par admin ${admin.username} pour l'utilisateur: ${targetUser.username}`,
        );

        return {
            message: `Mot de passe réinitialisé avec succès pour l'utilisateur ${targetUser.username}`,
            tempPassword: adminResetPasswordDto.newPassword ? undefined : tempPassword,
        };
    }

    /**
     * Générer un mot de passe temporaire sécurisé
     */
    private generateTempPassword(): string {
        const length = 12;
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        let password = '';

        // Assurer qu'il y a au moins une majuscule, une minuscule, un chiffre
        password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
        password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
        password += '0123456789'[Math.floor(Math.random() * 10)];

        // Remplir le reste
        for (let i = password.length; i < length; i++) {
            password += charset[Math.floor(Math.random() * charset.length)];
        }

        // Mélanger les caractères
        return password.split('').sort(() => Math.random() - 0.5).join('');
    }
}
