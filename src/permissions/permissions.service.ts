import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRole } from 'libs/dto/auth';
import {
  CreatePermissionDto,
  UpdatePermissionDto,
  AssignPermissionToRoleDto,
  AssignPermissionToUserDto,
  PermissionDto,
  RolePermissionsDto,
  UserPermissionsDto,
  CheckPermissionResponseDto,
  AssignMultiplePermissionsToRoleDto,
  AssignMultiplePermissionsToUserDto,
} from './dto/permission.dto';
import { DEFAULT_ROLE_PERMISSIONS } from './constants/default-role-permissions.constant';

@Injectable()
export class PermissionsService {
  private readonly logger = new Logger(PermissionsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Créer une nouvelle permission
   */
  async createPermission(dto: CreatePermissionDto): Promise<PermissionDto> {
    // Vérifier si la permission existe déjà
    const existing = await this.prisma.permission.findUnique({
      where: { name: dto.name },
    });

    if (existing && !existing.deletedAt) {
      throw new ConflictException(
        `La permission "${dto.name}" existe déjà`,
      );
    }

    const permission = await this.prisma.permission.create({
      data: {
        name: dto.name,
        resource: dto.resource,
        action: dto.action,
        description: dto.description,
      },
    });

    this.logger.log(`Permission créée: ${permission.name}`);
    return permission;
  }

  /**
   * Récupérer toutes les permissions
   */
  async getAllPermissions(): Promise<PermissionDto[]> {
    return this.prisma.permission.findMany({
      where: { deletedAt: null },
      orderBy: [{ resource: 'asc' }, { action: 'asc' }],
    });
  }

  /**
   * Récupérer une permission par ID
   */
  async getPermissionById(id: number): Promise<PermissionDto> {
    const permission = await this.prisma.permission.findUnique({
      where: { id, deletedAt: null },
    });

    if (!permission) {
      throw new NotFoundException(`Permission avec l'ID ${id} non trouvée`);
    }

    return permission;
  }

  /**
   * Récupérer une permission par nom
   */
  async getPermissionByName(name: string): Promise<PermissionDto | null> {
    return this.prisma.permission.findUnique({
      where: { name, deletedAt: null },
    });
  }

  /**
   * Mettre à jour une permission
   */
  async updatePermission(
    id: number,
    dto: UpdatePermissionDto,
  ): Promise<PermissionDto> {
    await this.getPermissionById(id); // Vérifier l'existence

    const permission = await this.prisma.permission.update({
      where: { id },
      data: dto,
    });

    this.logger.log(`Permission mise à jour: ${permission.name}`);
    return permission;
  }

  /**
   * Supprimer une permission (soft delete)
   */
  async deletePermission(id: number): Promise<void> {
    await this.getPermissionById(id); // Vérifier l'existence

    await this.prisma.permission.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    this.logger.log(`Permission supprimée: ID ${id}`);
  }

  /**
   * Attribuer une permission à un rôle
   */
  async assignPermissionToRole(
    dto: AssignPermissionToRoleDto,
  ): Promise<void> {
    await this.getPermissionById(dto.permissionId);

    await this.prisma.rolePermission.upsert({
      where: {
        role_permissionId: {
          role: dto.role,
          permissionId: dto.permissionId,
        },
      },
      create: {
        role: dto.role,
        permissionId: dto.permissionId,
        granted: dto.granted ?? true,
      },
      update: {
        granted: dto.granted ?? true,
        deletedAt: null,
      },
    });

    this.logger.log(
      `Permission ${dto.permissionId} ${dto.granted ? 'accordée' : 'révoquée'} pour le rôle ${dto.role}`,
    );
  }

  /**
   * Attribuer plusieurs permissions à un rôle
   */
  async assignMultiplePermissionsToRole(
    dto: AssignMultiplePermissionsToRoleDto,
  ): Promise<void> {
    // Vérifier que toutes les permissions existent
    const permissions = await this.prisma.permission.findMany({
      where: {
        id: { in: dto.permissionIds },
        deletedAt: null,
      },
    });

    if (permissions.length !== dto.permissionIds.length) {
      throw new BadRequestException(
        'Certaines permissions spécifiées n\'existent pas',
      );
    }

    // Attribuer les permissions
    await this.prisma.$transaction(
      dto.permissionIds.map((permissionId) =>
        this.prisma.rolePermission.upsert({
          where: {
            role_permissionId: {
              role: dto.role,
              permissionId,
            },
          },
          create: {
            role: dto.role,
            permissionId,
            granted: dto.granted ?? true,
          },
          update: {
            granted: dto.granted ?? true,
            deletedAt: null,
          },
        }),
      ),
    );

    this.logger.log(
      `${dto.permissionIds.length} permissions ${dto.granted ? 'accordées' : 'révoquées'} pour le rôle ${dto.role}`,
    );
  }

  /**
   * Récupérer les permissions d'un rôle
   */
  async getRolePermissions(role: UserRole): Promise<RolePermissionsDto> {
    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: {
        role,
        granted: true,
        deletedAt: null,
      },
      include: {
        permission: true,
      },
    });

    return {
      role,
      permissions: rolePermissions
        .map((rp) => rp.permission)
        .filter((p) => !p.deletedAt),
    };
  }

  /**
   * Attribuer une permission à un utilisateur
   */
  async assignPermissionToUser(
    dto: AssignPermissionToUserDto,
    grantedBy: number,
  ): Promise<void> {
    // Vérifier que l'utilisateur existe
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${dto.userId} non trouvé`);
    }

    // Vérifier que la permission existe
    await this.getPermissionById(dto.permissionId);

    // Attribuer la permission
    await this.prisma.userPermission.upsert({
      where: {
        userId_permissionId: {
          userId: dto.userId,
          permissionId: dto.permissionId,
        },
      },
      create: {
        userId: dto.userId,
        permissionId: dto.permissionId,
        granted: dto.granted,
        grantedBy,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      },
      update: {
        granted: dto.granted,
        grantedBy,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        deletedAt: null,
      },
    });

    this.logger.log(
      `Permission ${dto.permissionId} ${dto.granted ? 'accordée' : 'révoquée'} pour l'utilisateur ${dto.userId} par ${grantedBy}`,
    );
  }

  /**
   * Attribuer plusieurs permissions à un utilisateur
   */
  async assignMultiplePermissionsToUser(
    dto: AssignMultiplePermissionsToUserDto,
    grantedBy: number,
  ): Promise<void> {
    // Vérifier que l'utilisateur existe
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${dto.userId} non trouvé`);
    }

    // Vérifier que toutes les permissions existent
    const permissions = await this.prisma.permission.findMany({
      where: {
        id: { in: dto.permissionIds },
        deletedAt: null,
      },
    });

    if (permissions.length !== dto.permissionIds.length) {
      throw new BadRequestException(
        'Certaines permissions spécifiées n\'existent pas',
      );
    }

    // Attribuer les permissions
    await this.prisma.$transaction(
      dto.permissionIds.map((permissionId) =>
        this.prisma.userPermission.upsert({
          where: {
            userId_permissionId: {
              userId: dto.userId,
              permissionId,
            },
          },
          create: {
            userId: dto.userId,
            permissionId,
            granted: dto.granted,
            grantedBy,
            expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
          },
          update: {
            granted: dto.granted,
            grantedBy,
            expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
            deletedAt: null,
          },
        }),
      ),
    );

    this.logger.log(
      `${dto.permissionIds.length} permissions ${dto.granted ? 'accordées' : 'révoquées'} pour l'utilisateur ${dto.userId} par ${grantedBy}`,
    );
  }

  /**
   * Récupérer toutes les permissions d'un utilisateur (rôle + custom)
   */
  async getUserPermissions(userId: number): Promise<UserPermissionsDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé`);
    }

    // Permissions du rôle
    const rolePerms = await this.getRolePermissions(user.role);

    // Permissions accordées à l'utilisateur
    const grantedUserPerms = await this.prisma.userPermission.findMany({
      where: {
        userId,
        granted: true,
        deletedAt: null,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      include: { permission: true },
    });

    // Permissions révoquées explicitement
    const revokedUserPerms = await this.prisma.userPermission.findMany({
      where: {
        userId,
        granted: false,
        deletedAt: null,
      },
      include: { permission: true },
    });

    // Calcul des permissions effectives
    const rolePermNames = new Set(rolePerms.permissions.map((p) => p.name));
    const grantedNames = new Set(
      grantedUserPerms.map((up) => up.permission.name),
    );
    const revokedNames = new Set(
      revokedUserPerms.map((up) => up.permission.name),
    );

    const effectivePermissions = [
      ...Array.from(rolePermNames).filter((name) => !revokedNames.has(name)),
      ...Array.from(grantedNames),
    ];

    return {
      userId,
      rolePermissions: rolePerms.permissions,
      grantedPermissions: grantedUserPerms
        .map((up) => up.permission)
        .filter((p) => !p.deletedAt),
      revokedPermissions: revokedUserPerms
        .map((up) => up.permission)
        .filter((p) => !p.deletedAt),
      effectivePermissions: [...new Set(effectivePermissions)],
    };
  }

  /**
   * Vérifier si un utilisateur a une permission
   */
  async checkUserPermission(
    userId: number,
    permissionName: string,
  ): Promise<CheckPermissionResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé`);
    }

    // Vérifier permission utilisateur (révocation explicite)
    const userPerm = await this.prisma.userPermission.findFirst({
      where: {
        userId,
        permission: { name: permissionName },
        deletedAt: null,
      },
      include: { permission: true },
    });

    // Si révoqué explicitement, retourner false
    if (userPerm && !userPerm.granted) {
      return {
        hasPermission: false,
        source: 'none',
      };
    }

    // Si accordé explicitement (et non expiré)
    if (
      userPerm &&
      userPerm.granted &&
      (!userPerm.expiresAt || userPerm.expiresAt > new Date())
    ) {
      return {
        hasPermission: true,
        source: 'user',
        expiresAt: userPerm.expiresAt || undefined,
      };
    }

    // Vérifier permission du rôle
    const hasRolePermission =
      DEFAULT_ROLE_PERMISSIONS[user.role]?.includes(permissionName) ?? false;

    if (hasRolePermission) {
      return {
        hasPermission: true,
        source: 'role',
      };
    }

    // Vérifier en base de données si configuré
    const rolePermCount = await this.prisma.rolePermission.count({
      where: {
        role: user.role,
        permission: { name: permissionName },
        granted: true,
        deletedAt: null,
      },
    });

    if (rolePermCount > 0) {
      return {
        hasPermission: true,
        source: 'role',
      };
    }

    return {
      hasPermission: false,
      source: 'none',
    };
  }

  /**
   * Vérifier si un utilisateur a plusieurs permissions
   */
  async checkUserPermissions(
    userId: number,
    permissionNames: string[],
    mode: 'all' | 'any' = 'all',
  ): Promise<boolean> {
    const results = await Promise.all(
      permissionNames.map((name) => this.checkUserPermission(userId, name)),
    );

    if (mode === 'all') {
      return results.every((r) => r.hasPermission);
    } else {
      return results.some((r) => r.hasPermission);
    }
  }

  /**
   * Révoquer toutes les permissions custom d'un utilisateur
   */
  async revokeAllUserPermissions(userId: number): Promise<void> {
    await this.prisma.userPermission.updateMany({
      where: { userId },
      data: { deletedAt: new Date() },
    });

    this.logger.log(
      `Toutes les permissions custom révoquées pour l'utilisateur ${userId}`,
    );
  }
}
