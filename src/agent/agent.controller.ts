import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    HttpCode,
    HttpStatus,
    ParseIntPipe,
    ParseBoolPipe,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
    ApiBearerAuth,
    ApiBody,
} from '@nestjs/swagger';
import { AgentService } from './agent.service';
import {
    CreateAgentDto,
    UpdateAgentDto,
    AgentResponseDto,
    AgentWithRelationsDto,
} from 'libs/dto/agent/agent.dto';
import { AgentPaginationQueryDto } from 'libs/dto/agent/pagination.dto';
import {
    PaginatedResponseDto,
    SuccessResponseDto,
    ErrorResponseDto,
} from 'libs/dto/global/response.dto';
import { AgentDetailSchema } from 'libs/schema/agent/agent-detail.schema';
import { AllAgentSchema } from 'libs/schema/agent/all-agent.dto';

@ApiTags('Agents')
@ApiBearerAuth('JWT-auth')
@Controller('agents')
export class AgentController {
    constructor(private readonly agentService: AgentService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Créer un nouvel agent',
        description:
            'Crée un nouvel agent des douanes dans le système. ' +
            'Si createUserAccount=true, un compte utilisateur sera créé automatiquement ' +
            'et lié à l\'agent (username et password requis).',
    })
    @ApiBody({ type: CreateAgentDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Agent créé avec succès (avec ou sans compte utilisateur)',
        type: AgentResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Données invalides ou champs manquants pour la création du compte utilisateur',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Un agent avec ce matricule/email existe déjà, ou le username est déjà pris',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: ErrorResponseDto,
    })
    async create(
        @Body() createAgentDto: CreateAgentDto,
    ): Promise<AgentResponseDto> {
        return this.agentService.create(createAgentDto);
    }

    @Get()
    @ApiOperation({
        summary: 'Récupérer tous les agents',
        description:
            'Récupère une liste paginée de tous les agents avec filtres optionnels',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Liste des agents récupérée avec succès',
        //type: PaginatedResponseDto<AgentResponseDto>,
        schema: AllAgentSchema
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: ErrorResponseDto,
    })
    async findAll(
        @Query() paginationQuery: AgentPaginationQueryDto,
    ): Promise<PaginatedResponseDto<AgentResponseDto>> {
        return this.agentService.findAll(paginationQuery);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Récupérer un agent par ID',
        description: 'Récupère les détails d\'un agent spécifique par son ID',
    })
    @ApiParam({
        name: 'id',
        description: 'ID de l\'agent',
        type: Number,
        example: 1,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Agent récupéré avec succès',
        type: AgentWithRelationsDto,
        schema: AgentDetailSchema
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Agent non trouvé',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: ErrorResponseDto,
    })
    async findOne(
        @Param('id', ParseIntPipe) id: number
    ): Promise<AgentResponseDto | AgentWithRelationsDto> {
        return this.agentService.findOne(id);
    }

    @Get(':id/statistics')
    @ApiOperation({
        summary: 'Récupérer les statistiques d\'un agent',
        description:
            'Récupère les statistiques (nombre de déclarations, escouades, ordres de mission) d\'un agent',
    })
    @ApiParam({
        name: 'id',
        description: 'ID de l\'agent',
        type: Number,
        example: 1,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Statistiques récupérées avec succès',
        schema: {
            example: {
                agentId: 1,
                totalDeclarations: 45,
                totalEscouadesAsChef: 2,
                totalEscouadesAsAdjoint: 1,
                totalEscouadesMember: 3,
                totalOrdreMissions: 15,
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Agent non trouvé',
        type: ErrorResponseDto,
    })
    async getStatistics(@Param('id', ParseIntPipe) id: number) {
        return this.agentService.getStatistics(id);
    }

    @Put(':id')
    @ApiOperation({
        summary: 'Mettre à jour un agent',
        description: 'Met à jour les informations d\'un agent existant',
    })
    @ApiParam({
        name: 'id',
        description: 'ID de l\'agent à mettre à jour',
        type: Number,
        example: 1,
    })
    @ApiBody({ type: UpdateAgentDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Agent mis à jour avec succès',
        type: AgentResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Données invalides',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Agent non trouvé',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Un agent avec ce matricule ou email existe déjà',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: ErrorResponseDto,
    })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateAgentDto: UpdateAgentDto,
    ): Promise<AgentResponseDto> {
        return this.agentService.update(id, updateAgentDto);
    }

    @Put(':id/activate')
    @ApiOperation({
        summary: 'Activer un agent',
        description: 'Active un agent désactivé',
    })
    @ApiParam({
        name: 'id',
        description: 'ID de l\'agent',
        type: Number,
        example: 1,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Agent activé avec succès',
        type: SuccessResponseDto<AgentResponseDto>,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Agent non trouvé',
        type: ErrorResponseDto,
    })
    async activate(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<SuccessResponseDto<AgentResponseDto>> {
        const agent = await this.agentService.activate(id);
        return {
            success: true,
            message: 'Agent activé avec succès',
            data: agent,
        };
    }

    @Put(':id/deactivate')
    @ApiOperation({
        summary: 'Désactiver un agent',
        description: 'Désactive un agent actif',
    })
    @ApiParam({
        name: 'id',
        description: 'ID de l\'agent',
        type: Number,
        example: 1,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Agent désactivé avec succès',
        type: SuccessResponseDto<AgentResponseDto>,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Agent non trouvé',
        type: ErrorResponseDto,
    })
    async deactivate(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<SuccessResponseDto<AgentResponseDto>> {
        const agent = await this.agentService.deactivate(id);
        return {
            success: true,
            message: 'Agent désactivé avec succès',
            data: agent,
        };
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: 'Supprimer un agent',
        description: 'Désactive un agent (soft delete via isActive)',
    })
    @ApiParam({
        name: 'id',
        description: 'ID de l\'agent à supprimer',
        type: Number,
        example: 1,
    })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Agent désactivé avec succès',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Agent non trouvé',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: ErrorResponseDto,
    })
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.agentService.remove(id);
    }
}