import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsDateString,
  IsArray,
  IsEnum,
} from 'class-validator';
import { UserRole } from 'libs/dto/auth';

/**
 * DTO pour la création d'une permission
 */
export class CreatePermissionDto {
  @ApiProperty({
    description: 'Nom unique de la permission (format: resource.action)',
    example: 'declarations.create',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Ressource concernée',
    example: 'declarations',
  })
  @IsString()
  resource: string;

  @ApiProperty({
    description: 'Action autorisée',
    example: 'create',
  })
  @IsString()
  action: string;

  @ApiPropertyOptional({
    description: 'Description de la permission',
    example: 'Permet de créer une nouvelle déclaration',
  })
  @IsOptional()
  @IsString()
  description?: string;
}

/**
 * DTO pour la mise à jour d'une permission
 */
export class UpdatePermissionDto {
  @ApiPropertyOptional({
    description: 'Nom unique de la permission',
    example: 'declarations.create',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Description de la permission',
    example: 'Permet de créer une nouvelle déclaration',
  })
  @IsOptional()
  @IsString()
  description?: string;
}

/**
 * DTO pour l'attribution d'une permission à un rôle
 */
export class AssignPermissionToRoleDto {
  @ApiProperty({
    description: 'Rôle auquel attribuer la permission',
    enum: UserRole,
    example: UserRole.AGENT,
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({
    description: 'ID de la permission',
    example: 1,
  })
  @IsInt()
  permissionId: number;

  @ApiPropertyOptional({
    description: 'Accorder (true) ou révoquer (false) la permission',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  granted?: boolean;
}

/**
 * DTO pour l'attribution de plusieurs permissions à un rôle
 */
export class AssignMultiplePermissionsToRoleDto {
  @ApiProperty({
    description: 'Rôle auquel attribuer les permissions',
    enum: UserRole,
    example: UserRole.AGENT,
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({
    description: 'IDs des permissions',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray()
  @IsInt({ each: true })
  permissionIds: number[];

  @ApiPropertyOptional({
    description: 'Accorder (true) ou révoquer (false) les permissions',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  granted?: boolean;
}

/**
 * DTO pour l'attribution d'une permission à un utilisateur
 */
export class AssignPermissionToUserDto {
  @ApiProperty({
    description: 'ID de l\'utilisateur',
    example: 1,
  })
  @IsInt()
  userId: number;

  @ApiProperty({
    description: 'ID de la permission',
    example: 1,
  })
  @IsInt()
  permissionId: number;

  @ApiProperty({
    description: 'Accorder (true) ou révoquer (false) explicitement la permission',
    example: true,
  })
  @IsBoolean()
  granted: boolean;

  @ApiPropertyOptional({
    description: 'Date d\'expiration de la permission (format ISO 8601)',
    example: '2025-12-31T23:59:59.999Z',
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}

/**
 * DTO pour l'attribution de plusieurs permissions à un utilisateur
 */
export class AssignMultiplePermissionsToUserDto {
  @ApiProperty({
    description: 'ID de l\'utilisateur',
    example: 1,
  })
  @IsInt()
  userId: number;

  @ApiProperty({
    description: 'IDs des permissions',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray()
  @IsInt({ each: true })
  permissionIds: number[];

  @ApiProperty({
    description: 'Accorder (true) ou révoquer (false) explicitement les permissions',
    example: true,
  })
  @IsBoolean()
  granted: boolean;

  @ApiPropertyOptional({
    description: 'Date d\'expiration des permissions (format ISO 8601)',
    example: '2025-12-31T23:59:59.999Z',
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}

/**
 * DTO de réponse pour une permission
 */
export class PermissionDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'declarations.create' })
  name: string;

  @ApiProperty({ example: 'declarations' })
  resource: string;

  @ApiProperty({ example: 'create' })
  action: string;

  @ApiPropertyOptional({ example: 'Permet de créer une nouvelle déclaration' })
  description?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

/**
 * DTO de réponse pour les permissions d'un rôle
 */
export class RolePermissionsDto {
  @ApiProperty({ enum: UserRole, example: UserRole.AGENT })
  role: UserRole;

  @ApiProperty({ type: [PermissionDto] })
  permissions: PermissionDto[];
}

/**
 * DTO de réponse pour les permissions d'un utilisateur
 */
export class UserPermissionsDto {
  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({
    description: 'Permissions héritées du rôle',
    type: [PermissionDto],
  })
  rolePermissions: PermissionDto[];

  @ApiProperty({
    description: 'Permissions accordées directement à l\'utilisateur',
    type: [PermissionDto],
  })
  grantedPermissions: PermissionDto[];

  @ApiProperty({
    description: 'Permissions révoquées explicitement pour l\'utilisateur',
    type: [PermissionDto],
  })
  revokedPermissions: PermissionDto[];

  @ApiProperty({
    description: 'Permissions effectives (rôle + accordées - révoquées)',
    type: [String],
  })
  effectivePermissions: string[];
}

/**
 * DTO pour vérifier si un utilisateur a une permission
 */
export class CheckPermissionDto {
  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 'declarations.create' })
  permission: string;
}

/**
 * DTO de réponse pour la vérification de permission
 */
export class CheckPermissionResponseDto {
  @ApiProperty({ example: true })
  hasPermission: boolean;

  @ApiProperty({
    example: 'role',
    description: 'Source de la permission (role, user, none)',
  })
  source: 'role' | 'user' | 'none';

  @ApiPropertyOptional({
    example: '2025-12-31T23:59:59.999Z',
    description: 'Date d\'expiration si la permission est temporaire',
  })
  expiresAt?: Date;
}
