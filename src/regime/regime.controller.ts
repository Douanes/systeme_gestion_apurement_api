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
import { RegimeService } from './regime.service';
import {
  CreateRegimeDto,
  UpdateRegimeDto,
  RegimeResponseDto,
} from 'libs/dto/regime/regime.dto';
import { PaginationQueryDto } from 'libs/dto/global/pagination.dto';
import { PaginatedResponseDto, ErrorResponseDto } from 'libs/dto/global/response.dto';

@ApiTags('Régimes')
@ApiBearerAuth('JWT-auth')
@Controller('regimes')
export class RegimeController {
  constructor(private readonly regimeService: RegimeService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Créer un nouveau régime douanier',
    description: 'Crée un nouveau régime douanier dans le système',
  })
  @ApiBody({ type: CreateRegimeDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Régime créé avec succès',
    type: RegimeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Données invalides',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Un régime avec ce nom existe déjà',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Non authentifié',
    type: ErrorResponseDto,
  })
  async create(@Body() createRegimeDto: CreateRegimeDto): Promise<RegimeResponseDto> {
    return this.regimeService.create(createRegimeDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Récupérer tous les régimes',
    description: 'Récupère une liste paginée de tous les régimes douaniers avec filtres optionnels',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Liste des régimes récupérée avec succès',
    type: PaginatedResponseDto<RegimeResponseDto>,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Non authentifié',
    type: ErrorResponseDto,
  })
  async findAll(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<RegimeResponseDto>> {
    return this.regimeService.findAll(paginationQuery);
  }

  @Get('all')
  @ApiOperation({
    summary: 'Récupérer tous les régimes (sans pagination)',
    description: 'Récupère tous les régimes disponibles - utile pour les listes déroulantes',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Liste complète des régimes',
    type: [RegimeResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Non authentifié',
    type: ErrorResponseDto,
  })
  async findAllSimple(): Promise<RegimeResponseDto[]> {
    return this.regimeService.findAllSimple();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Récupérer un régime par ID',
    description: 'Récupère les détails d\'un régime spécifique par son ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID du régime',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Régime récupéré avec succès',
    type: RegimeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Régime non trouvé',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Non authentifié',
    type: ErrorResponseDto,
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<RegimeResponseDto> {
    return this.regimeService.findOne(id);
  }


  @Put(':id')
  @ApiOperation({
    summary: 'Mettre à jour un régime',
    description: 'Met à jour les informations d\'un régime existant',
  })
  @ApiParam({
    name: 'id',
    description: 'ID du régime à mettre à jour',
    type: Number,
    example: 1,
  })
  @ApiBody({ type: UpdateRegimeDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Régime mis à jour avec succès',
    type: RegimeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Données invalides',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Régime non trouvé',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Un régime avec ce nom existe déjà',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Non authentifié',
    type: ErrorResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRegimeDto: UpdateRegimeDto,
  ): Promise<RegimeResponseDto> {
    return this.regimeService.update(id, updateRegimeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Supprimer un régime',
    description: 'Supprime un régime du système (soft delete)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID du régime à supprimer',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Régime supprimé avec succès',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Régime non trouvé',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Non authentifié',
    type: ErrorResponseDto,
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.regimeService.remove(id);
  }
}