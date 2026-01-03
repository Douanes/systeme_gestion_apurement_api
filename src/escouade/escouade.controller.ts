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
import { EscouadeService } from './escouade.service';
import {
    CreateEscouadeDto,
    UpdateEscouadeDto,
    EscouadeResponseDto,
    EscouadeWithRelationsDto,
    AddAgentToEscouadeDto,
    RemoveAgentFromEscouadeDto,
} from 'libs/dto/escouade/escouade.dto';
import { EscouadePaginationQueryDto } from 'libs/dto/escouade/pagination.dto';
import {
    PaginatedResponseDto,
    SuccessResponseDto,
    ErrorResponseDto,
} from 'libs/dto/global/response.dto';

@ApiTags('Escouades')
@ApiBearerAuth('JWT-auth')
@Controller('escouades')
export class EscouadeController {
    constructor(private readonly escouadeService: EscouadeService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Créer une nouvelle escouade',
        description: 'Crée une nouvelle escouade d\'agents dans le système',
    })
    @ApiBody({ type: CreateEscouadeDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Escouade créée avec succès',
        type: EscouadeResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Données invalides',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Une escouade avec ce nom existe déjà',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: ErrorResponseDto,
    })
    async create(
        @Body() createEscouadeDto: CreateEscouadeDto,
    ): Promise<EscouadeResponseDto> {
        return this.escouadeService.create(createEscouadeDto);
    }

    @Get()
    @ApiOperation({
        summary: 'Récupérer toutes les escouades',
        description:
            'Récupère une liste paginée de toutes les escouades avec leurs chefs et adjoints',
    })
    @ApiQuery({ type: EscouadePaginationQueryDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Liste des escouades récupérée avec succès',
        type: PaginatedResponseDto<EscouadeWithRelationsDto>,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: ErrorResponseDto,
    })
    async findAll(
        @Query() paginationQuery: EscouadePaginationQueryDto,
    ): Promise<PaginatedResponseDto<EscouadeWithRelationsDto>> {
        return this.escouadeService.findAll(paginationQuery);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Récupérer une escouade par ID',
        description: 'Récupère les détails d\'une escouade spécifique par son ID',
    })
    @ApiParam({
        name: 'id',
        description: 'ID de l\'escouade',
        type: Number,
        example: 1,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Escouade récupérée avec succès',
        type: EscouadeWithRelationsDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Escouade non trouvée',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: ErrorResponseDto,
    })
    async findOne(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<EscouadeWithRelationsDto> {
        return this.escouadeService.findOne(id);
    }

    @Get(':id/statistics')
    @ApiOperation({
        summary: 'Récupérer les statistiques d\'une escouade',
        description: 'Récupère les statistiques (nombre d\'agents) d\'une escouade',
    })
    @ApiParam({
        name: 'id',
        description: 'ID de l\'escouade',
        type: Number,
        example: 1,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Statistiques récupérées avec succès',
        schema: {
            example: {
                escouadeId: 1,
                totalAgents: 12,
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Escouade non trouvée',
        type: ErrorResponseDto,
    })
    async getStatistics(@Param('id', ParseIntPipe) id: number) {
        return this.escouadeService.getStatistics(id);
    }

    @Put(':id')
    @ApiOperation({
        summary: 'Mettre à jour une escouade',
        description: 'Met à jour les informations d\'une escouade existante',
    })
    @ApiParam({
        name: 'id',
        description: 'ID de l\'escouade à mettre à jour',
        type: Number,
        example: 1,
    })
    @ApiBody({ type: UpdateEscouadeDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Escouade mise à jour avec succès',
        type: EscouadeResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Données invalides',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Escouade non trouvée',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Une escouade avec ce nom existe déjà',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: ErrorResponseDto,
    })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateEscouadeDto: UpdateEscouadeDto,
    ): Promise<EscouadeResponseDto> {
        return this.escouadeService.update(id, updateEscouadeDto);
    }

    @Post(':id/agents')
    @ApiOperation({
        summary: 'Ajouter un agent à l\'escouade',
        description: 'Ajoute un agent comme membre de l\'escouade',
    })
    @ApiParam({
        name: 'id',
        description: 'ID de l\'escouade',
        type: Number,
        example: 1,
    })
    @ApiBody({ type: AddAgentToEscouadeDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Agent ajouté avec succès',
        type: SuccessResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Escouade ou agent non trouvé',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'L\'agent est déjà membre de cette escouade',
        type: ErrorResponseDto,
    })
    async addAgent(
        @Param('id', ParseIntPipe) id: number,
        @Body() addAgentDto: AddAgentToEscouadeDto,
    ): Promise<SuccessResponseDto<null>> {
        await this.escouadeService.addAgent(id, addAgentDto.agentId);
        return {
            success: true,
            message: 'Agent ajouté à l\'escouade avec succès',
        };
    }

    @Delete(':id/agents/:agentId')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Retirer un agent de l\'escouade',
        description: 'Retire un agent des membres de l\'escouade',
    })
    @ApiParam({
        name: 'id',
        description: 'ID de l\'escouade',
        type: Number,
        example: 1,
    })
    @ApiParam({
        name: 'agentId',
        description: 'ID de l\'agent à retirer',
        type: Number,
        example: 5,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Agent retiré avec succès',
        type: SuccessResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Escouade non trouvée ou agent pas membre',
        type: ErrorResponseDto,
    })
    async removeAgent(
        @Param('id', ParseIntPipe) id: number,
        @Param('agentId', ParseIntPipe) agentId: number,
    ): Promise<SuccessResponseDto<null>> {
        await this.escouadeService.removeAgent(id, agentId);
        return {
            success: true,
            message: 'Agent retiré de l\'escouade avec succès',
        };
    }

    @Put(':id/chef/:chefId')
    @ApiOperation({
        summary: 'Assigner un chef à l\'escouade',
        description: 'Assigne ou modifie le chef de l\'escouade',
    })
    @ApiParam({
        name: 'id',
        description: 'ID de l\'escouade',
        type: Number,
        example: 1,
    })
    @ApiParam({
        name: 'chefId',
        description: 'ID de l\'agent à assigner comme chef',
        type: Number,
        example: 3,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Chef assigné avec succès',
        type: SuccessResponseDto<EscouadeResponseDto>,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Escouade ou agent non trouvé',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Le chef ne peut pas être le même que l\'adjoint',
        type: ErrorResponseDto,
    })
    async assignChef(
        @Param('id', ParseIntPipe) id: number,
        @Param('chefId', ParseIntPipe) chefId: number,
    ): Promise<SuccessResponseDto<EscouadeResponseDto>> {
        const escouade = await this.escouadeService.assignChef(id, chefId);
        return {
            success: true,
            message: 'Chef assigné avec succès',
            data: escouade,
        };
    }

    @Put(':id/adjoint/:adjointId')
    @ApiOperation({
        summary: 'Assigner un adjoint à l\'escouade',
        description: 'Assigne ou modifie l\'adjoint du chef de l\'escouade',
    })
    @ApiParam({
        name: 'id',
        description: 'ID de l\'escouade',
        type: Number,
        example: 1,
    })
    @ApiParam({
        name: 'adjointId',
        description: 'ID de l\'agent à assigner comme adjoint',
        type: Number,
        example: 4,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Adjoint assigné avec succès',
        type: SuccessResponseDto<EscouadeResponseDto>,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Escouade ou agent non trouvé',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'L\'adjoint ne peut pas être le même que le chef',
        type: ErrorResponseDto,
    })
    async assignAdjoint(
        @Param('id', ParseIntPipe) id: number,
        @Param('adjointId', ParseIntPipe) adjointId: number,
    ): Promise<SuccessResponseDto<EscouadeResponseDto>> {
        const escouade = await this.escouadeService.assignAdjoint(id, adjointId);
        return {
            success: true,
            message: 'Adjoint assigné avec succès',
            data: escouade,
        };
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: 'Supprimer une escouade',
        description: 'Supprime une escouade du système (soft delete)',
    })
    @ApiParam({
        name: 'id',
        description: 'ID de l\'escouade à supprimer',
        type: Number,
        example: 1,
    })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Escouade supprimée avec succès',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Escouade non trouvée',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description:
            'Impossible de supprimer: escouade contient des agents',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: ErrorResponseDto,
    })
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.escouadeService.remove(id);
    }
}