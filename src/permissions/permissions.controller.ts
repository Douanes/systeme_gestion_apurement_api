import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { RequirePermissions } from './decorators/require-permissions.decorator';
import { PERMISSIONS } from './constants/permissions.constant';
import { UserRole } from 'libs/dto/auth';
import { ErrorResponseDto } from 'libs/dto/global/response.dto';

@ApiTags('Gestion des Permissions')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  /**
   * Créer une nouvelle permission
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequirePermissions(PERMISSIONS.PERMISSIONS_ASSIGN)
  @ApiOperation({
    summary: 'Créer une nouvelle permission',
    description: 'Permet à un administrateur de créer une nouvelle permission système.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Permission créée avec succès',
    type: PermissionDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'La permission existe déjà',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Accès refusé',
    type: ErrorResponseDto,
  })
  async createPermission(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<PermissionDto> {
    return this.permissionsService.createPermission(createPermissionDto);
  }

  /**
   * Récupérer toutes les permissions
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PERMISSIONS.PERMISSIONS_READ)
  @ApiOperation({
    summary: 'Récupérer toutes les permissions',
    description: 'Retourne la liste de toutes les permissions du système.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Liste des permissions récupérée avec succès',
    type: [PermissionDto],
  })
  async getAllPermissions(): Promise<PermissionDto[]> {
    return this.permissionsService.getAllPermissions();
  }

  /**
   * Récupérer une permission par ID
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PERMISSIONS.PERMISSIONS_READ)
  @ApiOperation({
    summary: 'Récupérer une permission par ID',
    description: 'Retourne les détails d\'une permission spécifique.',
  })
  @ApiParam({ name: 'id', description: 'ID de la permission' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Permission récupérée avec succès',
    type: PermissionDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Permission non trouvée',
    type: ErrorResponseDto,
  })
  async getPermissionById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PermissionDto> {
    return this.permissionsService.getPermissionById(id);
  }

  /**
   * Mettre à jour une permission
   */
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PERMISSIONS.PERMISSIONS_ASSIGN)
  @ApiOperation({
    summary: 'Mettre à jour une permission',
    description: 'Permet de modifier les détails d\'une permission.',
  })
  @ApiParam({ name: 'id', description: 'ID de la permission' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Permission mise à jour avec succès',
    type: PermissionDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Permission non trouvée',
    type: ErrorResponseDto,
  })
  async updatePermission(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ): Promise<PermissionDto> {
    return this.permissionsService.updatePermission(id, updatePermissionDto);
  }

  /**
   * Supprimer une permission
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(PERMISSIONS.PERMISSIONS_REVOKE)
  @ApiOperation({
    summary: 'Supprimer une permission',
    description: 'Supprime une permission du système (soft delete).',
  })
  @ApiParam({ name: 'id', description: 'ID de la permission' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Permission supprimée avec succès',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Permission non trouvée',
    type: ErrorResponseDto,
  })
  async deletePermission(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.permissionsService.deletePermission(id);
  }

  /**
   * Attribuer une permission à un rôle
   */
  @Post('roles/assign')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PERMISSIONS.PERMISSIONS_ASSIGN)
  @ApiOperation({
    summary: 'Attribuer une permission à un rôle',
    description: 'Accorde ou révoque une permission pour un rôle spécifique.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Permission attribuée avec succès',
  })
  async assignPermissionToRole(
    @Body() dto: AssignPermissionToRoleDto,
  ): Promise<{ message: string }> {
    await this.permissionsService.assignPermissionToRole(dto);
    return {
      message: `Permission ${dto.granted ? 'accordée' : 'révoquée'} pour le rôle ${dto.role}`,
    };
  }

  /**
   * Attribuer plusieurs permissions à un rôle
   */
  @Post('roles/assign-multiple')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PERMISSIONS.PERMISSIONS_ASSIGN)
  @ApiOperation({
    summary: 'Attribuer plusieurs permissions à un rôle',
    description: 'Accorde ou révoque plusieurs permissions pour un rôle spécifique.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Permissions attribuées avec succès',
  })
  async assignMultiplePermissionsToRole(
    @Body() dto: AssignMultiplePermissionsToRoleDto,
  ): Promise<{ message: string }> {
    await this.permissionsService.assignMultiplePermissionsToRole(dto);
    return {
      message: `${dto.permissionIds.length} permissions ${dto.granted ? 'accordées' : 'révoquées'} pour le rôle ${dto.role}`,
    };
  }

  /**
   * Récupérer les permissions d'un rôle
   */
  @Get('roles/:role')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PERMISSIONS.PERMISSIONS_READ)
  @ApiOperation({
    summary: 'Récupérer les permissions d\'un rôle',
    description: 'Retourne toutes les permissions associées à un rôle.',
  })
  @ApiParam({ name: 'role', enum: UserRole, description: 'Rôle' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Permissions du rôle récupérées avec succès',
    type: RolePermissionsDto,
  })
  async getRolePermissions(
    @Param('role') role: UserRole,
  ): Promise<RolePermissionsDto> {
    return this.permissionsService.getRolePermissions(role);
  }

  /**
   * Attribuer une permission à un utilisateur
   */
  @Post('users/assign')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PERMISSIONS.USERS_MANAGE_PERMISSIONS)
  @ApiOperation({
    summary: 'Attribuer une permission à un utilisateur',
    description:
      'Accorde ou révoque explicitement une permission pour un utilisateur spécifique.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Permission attribuée avec succès',
  })
  async assignPermissionToUser(
    @Request() req,
    @Body() dto: AssignPermissionToUserDto,
  ): Promise<{ message: string }> {
    await this.permissionsService.assignPermissionToUser(dto, req.user.id);
    return {
      message: `Permission ${dto.granted ? 'accordée' : 'révoquée'} pour l'utilisateur ${dto.userId}`,
    };
  }

  /**
   * Attribuer plusieurs permissions à un utilisateur
   */
  @Post('users/assign-multiple')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PERMISSIONS.USERS_MANAGE_PERMISSIONS)
  @ApiOperation({
    summary: 'Attribuer plusieurs permissions à un utilisateur',
    description:
      'Accorde ou révoque explicitement plusieurs permissions pour un utilisateur spécifique.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Permissions attribuées avec succès',
  })
  async assignMultiplePermissionsToUser(
    @Request() req,
    @Body() dto: AssignMultiplePermissionsToUserDto,
  ): Promise<{ message: string }> {
    await this.permissionsService.assignMultiplePermissionsToUser(
      dto,
      req.user.id,
    );
    return {
      message: `${dto.permissionIds.length} permissions ${dto.granted ? 'accordées' : 'révoquées'} pour l'utilisateur ${dto.userId}`,
    };
  }

  /**
   * Récupérer les permissions d'un utilisateur
   */
  @Get('users/:userId')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PERMISSIONS.PERMISSIONS_READ)
  @ApiOperation({
    summary: 'Récupérer les permissions d\'un utilisateur',
    description:
      'Retourne toutes les permissions d\'un utilisateur (rôle + custom).',
  })
  @ApiParam({ name: 'userId', description: 'ID de l\'utilisateur' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Permissions de l\'utilisateur récupérées avec succès',
    type: UserPermissionsDto,
  })
  async getUserPermissions(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<UserPermissionsDto> {
    return this.permissionsService.getUserPermissions(userId);
  }

  /**
   * Vérifier si un utilisateur a une permission
   */
  @Get('users/:userId/check')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(PERMISSIONS.PERMISSIONS_READ)
  @ApiOperation({
    summary: 'Vérifier si un utilisateur a une permission',
    description: 'Vérifie si un utilisateur possède une permission spécifique.',
  })
  @ApiParam({ name: 'userId', description: 'ID de l\'utilisateur' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Vérification effectuée avec succès',
    type: CheckPermissionResponseDto,
  })
  async checkUserPermission(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('permission') permission: string,
  ): Promise<CheckPermissionResponseDto> {
    return this.permissionsService.checkUserPermission(userId, permission);
  }

  /**
   * Révoquer toutes les permissions custom d'un utilisateur
   */
  @Delete('users/:userId/revoke-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(PERMISSIONS.USERS_MANAGE_PERMISSIONS)
  @ApiOperation({
    summary: 'Révoquer toutes les permissions custom d\'un utilisateur',
    description:
      'Supprime toutes les permissions personnalisées d\'un utilisateur (garde les permissions du rôle).',
  })
  @ApiParam({ name: 'userId', description: 'ID de l\'utilisateur' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Permissions révoquées avec succès',
  })
  async revokeAllUserPermissions(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<void> {
    return this.permissionsService.revokeAllUserPermissions(userId);
  }
}
