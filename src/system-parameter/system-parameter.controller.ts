import {
    Controller,
    Get,
    Put,
    Delete,
    Body,
    Param,
    HttpStatus,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBearerAuth,
    ApiBody,
} from '@nestjs/swagger';
import { SystemParameterService } from './system-parameter.service';
import {
    SystemParameterResponseDto,
    UpdateSystemParameterContactDto,
} from 'libs/dto/system-parameter';
import {
    SuccessResponseDto,
    ErrorResponseDto,
} from 'libs/dto/global/response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators';
import { UserRole } from 'libs/dto/auth';

@ApiTags('Paramètres Système')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('system-parameters')
export class SystemParameterController {
    constructor(private readonly systemParameterService: SystemParameterService) {}

    @Get()
    @ApiOperation({
        summary: 'Récupérer les paramètres système',
        description: 'Récupère les paramètres système avec les informations de contact et les chefs assignés',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Paramètres système récupérés avec succès',
        type: SystemParameterResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: ErrorResponseDto,
    })
    async findOne(): Promise<SystemParameterResponseDto> {
        return this.systemParameterService.findOne();
    }

    @Put()
    @Roles(UserRole.ADMIN)
    @ApiOperation({
        summary: 'Mettre à jour les informations de contact',
        description: 'Met à jour le téléphone, email et adresse des paramètres système',
    })
    @ApiBody({ type: UpdateSystemParameterContactDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Paramètres mis à jour avec succès',
        type: SystemParameterResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Données invalides',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Accès refusé - Rôle ADMIN requis',
        type: ErrorResponseDto,
    })
    async updateContact(
        @Body() dto: UpdateSystemParameterContactDto,
    ): Promise<SystemParameterResponseDto> {
        return this.systemParameterService.updateContact(dto);
    }

    @Put('chef-bureau/:agentId')
    @Roles(UserRole.ADMIN)
    @ApiOperation({
        summary: 'Assigner un chef de bureau',
        description: 'Assigne un agent comme chef de bureau. Vérifie l\'exclusivité avec les escouades et le chef de section',
    })
    @ApiParam({
        name: 'agentId',
        description: 'ID de l\'agent à assigner comme chef de bureau',
        type: Number,
        example: 3,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Chef de bureau assigné avec succès',
        type: SuccessResponseDto<SystemParameterResponseDto>,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Agent non trouvé',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Agent déjà assigné ailleurs',
        type: ErrorResponseDto,
    })
    async assignChefBureau(
        @Param('agentId', ParseIntPipe) agentId: number,
    ): Promise<SuccessResponseDto<SystemParameterResponseDto>> {
        const param = await this.systemParameterService.assignChefBureau(agentId);
        return {
            success: true,
            message: 'Chef de bureau assigné avec succès',
            data: param,
        };
    }

    @Delete('chef-bureau')
    @Roles(UserRole.ADMIN)
    @ApiOperation({
        summary: 'Retirer le chef de bureau',
        description: 'Retire le chef de bureau assigné (met chefBureauId à null)',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Chef de bureau retiré avec succès',
        type: SuccessResponseDto<SystemParameterResponseDto>,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Aucun chef de bureau assigné',
        type: ErrorResponseDto,
    })
    async removeChefBureau(): Promise<SuccessResponseDto<SystemParameterResponseDto>> {
        const param = await this.systemParameterService.removeChefBureau();
        return {
            success: true,
            message: 'Chef de bureau retiré avec succès',
            data: param,
        };
    }

    @Put('chef-section/:agentId')
    @Roles(UserRole.ADMIN)
    @ApiOperation({
        summary: 'Assigner un chef de section',
        description: 'Assigne un agent comme chef de section. Vérifie l\'exclusivité avec les escouades et le chef de bureau',
    })
    @ApiParam({
        name: 'agentId',
        description: 'ID de l\'agent à assigner comme chef de section',
        type: Number,
        example: 5,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Chef de section assigné avec succès',
        type: SuccessResponseDto<SystemParameterResponseDto>,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Agent non trouvé',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Agent déjà assigné ailleurs',
        type: ErrorResponseDto,
    })
    async assignChefSection(
        @Param('agentId', ParseIntPipe) agentId: number,
    ): Promise<SuccessResponseDto<SystemParameterResponseDto>> {
        const param = await this.systemParameterService.assignChefSection(agentId);
        return {
            success: true,
            message: 'Chef de section assigné avec succès',
            data: param,
        };
    }

    @Delete('chef-section')
    @Roles(UserRole.ADMIN)
    @ApiOperation({
        summary: 'Retirer le chef de section',
        description: 'Retire le chef de section assigné (met chefSectionId à null)',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Chef de section retiré avec succès',
        type: SuccessResponseDto<SystemParameterResponseDto>,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Aucun chef de section assigné',
        type: ErrorResponseDto,
    })
    async removeChefSection(): Promise<SuccessResponseDto<SystemParameterResponseDto>> {
        const param = await this.systemParameterService.removeChefSection();
        return {
            success: true,
            message: 'Chef de section retiré avec succès',
            data: param,
        };
    }
}
