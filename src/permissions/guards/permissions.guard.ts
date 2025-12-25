import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY, PermissionOptions } from '../decorators/require-permissions.decorator';
import { PermissionsService } from '../permissions.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);

  constructor(
    private reflector: Reflector,
    private permissionsService: PermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Récupérer les métadonnées de permissions
    const permissionMetadata = this.reflector.getAllAndOverride<{
      permissions: string[];
      options: PermissionOptions;
    } | undefined>(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    // Si aucune permission n'est requise, autoriser l'accès
    if (!permissionMetadata) {
      return true;
    }

    const { permissions, options } = permissionMetadata;
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Vérifier que l'utilisateur est authentifié
    if (!user || !user.id) {
      this.logger.warn('Tentative d\'accès sans authentification');
      throw new ForbiddenException(
        'Vous devez être authentifié pour accéder à cette ressource',
      );
    }

    // Vérifier les permissions
    const hasPermission = await this.checkPermissions(
      user.id,
      permissions,
      options,
      request,
    );

    if (!hasPermission) {
      this.logger.warn(
        `Accès refusé pour l'utilisateur ${user.id} - Permissions requises: ${permissions.join(', ')}`,
      );
      throw new ForbiddenException(
        'Vous n\'avez pas les permissions nécessaires pour accéder à cette ressource',
      );
    }

    return true;
  }

  /**
   * Vérifier si l'utilisateur a les permissions requises
   */
  private async checkPermissions(
    userId: number,
    permissions: string[],
    options: PermissionOptions,
    request: any,
  ): Promise<boolean> {
    const mode = options.mode || 'all';

    // Vérifier les permissions
    const hasPermissions = await this.permissionsService.checkUserPermissions(
      userId,
      permissions,
      mode,
    );

    if (!hasPermissions) {
      return false;
    }

    // Vérifier l'ownership si requis
    if (options.requireOwnership) {
      return this.checkOwnership(userId, options, request);
    }

    return true;
  }

  /**
   * Vérifier si l'utilisateur est le propriétaire de la ressource
   */
  private async checkOwnership(
    userId: number,
    options: PermissionOptions,
    request: any,
  ): Promise<boolean> {
    // Récupérer l'ID de la ressource depuis les paramètres
    const resourceId = request.params.id;

    if (!resourceId) {
      this.logger.warn('Ownership check: resourceId non trouvé dans les paramètres');
      return false;
    }

    // Déterminer le champ d'ownership
    const ownershipField = options.ownershipField || 'createdById';

    // TODO: Implémenter la logique de vérification d'ownership
    // Cela nécessiterait de connaître le type de ressource et d'interroger la base de données
    // Pour l'instant, on retourne true si l'utilisateur a les permissions
    // Cette logique peut être améliorée en fonction des besoins spécifiques

    this.logger.debug(
      `Ownership check: userId=${userId}, resourceId=${resourceId}, field=${ownershipField}`,
    );

    return true;
  }
}
