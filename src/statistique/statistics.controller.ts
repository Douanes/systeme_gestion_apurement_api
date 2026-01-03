import {
    Controller,
    Get,
    Query,
    HttpStatus,
    ParseIntPipe,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiQuery,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import {
    ApurementStatisticsQueryDto,
    ApurementStatisticsResponseDto,
    ApurementByBureauResponseDto,
    ApurementTrendResponseDto,
    PeriodFilter,
} from 'libs/dto/statistics/apurement-statistics.dto';

@ApiTags('Statistiques & Rapports')
@ApiBearerAuth('JWT-auth')
@Controller('statistics')
export class StatisticsController {
    constructor(private readonly statisticsService: StatisticsService) { }

    @Get('apurement')
    @ApiOperation({
        summary: 'Statistiques d\'apurement globales',
        description:
            'Récupère les statistiques d\'apurement (apurés, non apurés, rejetés) avec filtres par période et bureau',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Statistiques d\'apurement récupérées avec succès',
        type: ApurementStatisticsResponseDto,
        schema: {
            example: {
                totalOrdres: 150,
                apures: 120,
                nonApures: 25,
                rejetes: 5,
                tauxApurement: 80.0,
                periode: {
                    debut: '2024-01-01T00:00:00.000Z',
                    fin: '2024-12-31T23:59:59.999Z',
                },
                bureauSortie: {
                    id: 1,
                    name: 'Bureau Dakar',
                    code: 'BDS-001',
                },
            },
        },
    })
    async getApurementStatistics(
        @Query() query: ApurementStatisticsQueryDto,
    ): Promise<ApurementStatisticsResponseDto> {
        return this.statisticsService.getApurementStatistics(query);
    }

    @Get('apurement/by-bureau')
    @ApiOperation({
        summary: 'Statistiques d\'apurement par bureau de sortie',
        description:
            'Récupère les statistiques d\'apurement groupées par bureau de sortie',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Statistiques par bureau récupérées avec succès',
        type: [ApurementByBureauResponseDto],
        schema: {
            example: [
                {
                    bureauSortieId: 1,
                    bureauName: 'Bureau Dakar',
                    bureauCode: 'BDS-001',
                    totalOrdres: 50,
                    apures: 40,
                    nonApures: 8,
                    rejetes: 2,
                    tauxApurement: 80.0,
                },
                {
                    bureauSortieId: 2,
                    bureauName: 'Bureau Thiès',
                    bureauCode: 'BDS-002',
                    totalOrdres: 30,
                    apures: 25,
                    nonApures: 4,
                    rejetes: 1,
                    tauxApurement: 83.33,
                },
            ],
        },
    })
    async getApurementByBureau(
        @Query() query: ApurementStatisticsQueryDto,
    ): Promise<ApurementByBureauResponseDto[]> {
        return this.statisticsService.getApurementByBureau(query);
    }

    @Get('apurement/trend')
    @ApiOperation({
        summary: 'Tendance d\'apurement dans le temps',
        description:
            'Récupère l\'évolution des statistiques d\'apurement par jour, semaine ou mois',
    })
    @ApiQuery({
        name: 'bureauSortieId',
        required: false,
        type: Number,
        description: 'ID du bureau de sortie',
        example: 1,
    })
    @ApiQuery({
        name: 'dateDebut',
        required: false,
        type: String,
        description: 'Date de début (format ISO)',
        example: '2024-01-01',
    })
    @ApiQuery({
        name: 'dateFin',
        required: false,
        type: String,
        description: 'Date de fin (format ISO)',
        example: '2024-12-31',
    })
    @ApiQuery({
        name: 'period',
        required: false,
        enum: PeriodFilter,
        description: 'Période prédéfinie',
        example: PeriodFilter.THIS_YEAR,
    })
    @ApiQuery({
        name: 'groupBy',
        required: false,
        enum: ['day', 'week', 'month'],
        description: 'Groupement des données',
        example: 'month',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Tendance d\'apurement récupérée avec succès',
        type: [ApurementTrendResponseDto],
        schema: {
            example: [
                {
                    period: '2024-01',
                    totalOrdres: 45,
                    apures: 36,
                    nonApures: 7,
                    rejetes: 2,
                    tauxApurement: 80.0,
                },
                {
                    period: '2024-02',
                    totalOrdres: 52,
                    apures: 44,
                    nonApures: 6,
                    rejetes: 2,
                    tauxApurement: 84.62,
                },
            ],
        },
    })
    async getApurementTrend(
        @Query('bureauSortieId', new ParseIntPipe({ optional: true }))
        bureauSortieId?: number,
        @Query('dateDebut') dateDebut?: string,
        @Query('dateFin') dateFin?: string,
        @Query('period') period?: PeriodFilter,
        @Query('groupBy') groupBy?: 'day' | 'week' | 'month',
    ): Promise<ApurementTrendResponseDto[]> {
        return this.statisticsService.getApurementTrend({
            bureauSortieId,
            dateDebut,
            dateFin,
            period,
            groupBy,
        });
    }

    @Get('dashboard')
    @ApiOperation({
        summary: 'Vue d\'ensemble du dashboard',
        description:
            'Récupère un aperçu complet avec comparaison période précédente et top/bottom bureaux',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Vue d\'ensemble récupérée avec succès',
        schema: {
            example: {
                current: {
                    totalOrdres: 150,
                    apures: 120,
                    nonApures: 25,
                    rejetes: 5,
                    tauxApurement: 80.0,
                    periode: {
                        debut: '2024-11-01T00:00:00.000Z',
                        fin: '2024-11-30T23:59:59.999Z',
                    },
                },
                previous: {
                    totalOrdres: 140,
                    apures: 105,
                    nonApures: 30,
                    rejetes: 5,
                    tauxApurement: 75.0,
                    periode: {
                        debut: '2024-10-01T00:00:00.000Z',
                        fin: '2024-10-31T23:59:59.999Z',
                    },
                },
                comparison: {
                    totalOrdresChange: 7.14,
                    tauxApurementChange: 6.67,
                },
                topBureaux: [
                    {
                        bureauSortieId: 3,
                        bureauName: 'Bureau Saint-Louis',
                        bureauCode: 'BDS-003',
                        totalOrdres: 70,
                        apures: 62,
                        tauxApurement: 88.57,
                    },
                ],
                bottomBureaux: [
                    {
                        bureauSortieId: 5,
                        bureauName: 'Bureau Ziguinchor',
                        bureauCode: 'BDS-005',
                        totalOrdres: 40,
                        apures: 28,
                        tauxApurement: 70.0,
                    },
                ],
            },
        },
    })
    async getDashboardOverview(@Query() query: ApurementStatisticsQueryDto) {
        return this.statisticsService.getDashboardOverview(query);
    }

    @Get('marchandises')
    @ApiOperation({
        summary: 'Statistiques par nature de marchandise',
        description:
            'Récupère les statistiques détaillées pour chaque type de marchandise (colis)',
    })
    @ApiQuery({
        name: 'bureauSortieId',
        required: false,
        type: Number,
        description: 'ID du bureau de sortie',
        example: 1,
    })
    @ApiQuery({
        name: 'dateDebut',
        required: false,
        type: String,
        description: 'Date de début (format ISO)',
        example: '2024-01-01',
    })
    @ApiQuery({
        name: 'dateFin',
        required: false,
        type: String,
        description: 'Date de fin (format ISO)',
        example: '2024-12-31',
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Nombre maximum de résultats',
        example: 20,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Statistiques des marchandises récupérées avec succès',
        schema: {
            example: {
                marchandises: [
                    {
                        natureMarchandise: 'Électronique',
                        totalColis: 125,
                        poidsTotal: 15420.5,
                        valeurTotale: 125000000,
                        poidsMoyen: 123.36,
                        valeurMoyenne: 1000000,
                        nombreOrdres: 45,
                        pourcentage: 15.5,
                    },
                    {
                        natureMarchandise: 'Textile',
                        totalColis: 98,
                        poidsTotal: 8750.2,
                        valeurTotale: 45000000,
                        poidsMoyen: 89.29,
                        valeurMoyenne: 459183.67,
                        nombreOrdres: 32,
                        pourcentage: 12.2,
                    },
                ],
                totaux: {
                    totalColis: 805,
                    poidsTotal: 98754.32,
                    valeurTotale: 985000000,
                    nombreMarchandisesDistinctes: 15,
                },
                periode: {
                    debut: '2024-01-01T00:00:00.000Z',
                    fin: '2024-12-31T23:59:59.999Z',
                },
                bureauSortie: {
                    id: 1,
                    name: 'Bureau Dakar',
                    code: 'BDS-001',
                },
            },
        },
    })
    async getMarchandiseStatistics(
        @Query('bureauSortieId', new ParseIntPipe({ optional: true }))
        bureauSortieId?: number,
        @Query('dateDebut') dateDebut?: string,
        @Query('dateFin') dateFin?: string,
        @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    ) {
        return this.statisticsService.getMarchandiseStatistics({
            bureauSortieId,
            dateDebut,
            dateFin,
            limit,
        });
    }

    @Get('marchandises/by-bureau')
    @ApiOperation({
        summary: 'Statistiques des marchandises par bureau',
        description:
            'Récupère les statistiques des marchandises groupées par bureau de sortie',
    })
    @ApiQuery({
        name: 'dateDebut',
        required: false,
        type: String,
        description: 'Date de début (format ISO)',
        example: '2024-01-01',
    })
    @ApiQuery({
        name: 'dateFin',
        required: false,
        type: String,
        description: 'Date de fin (format ISO)',
        example: '2024-12-31',
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Nombre maximum de marchandises par bureau',
        example: 10,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Statistiques par bureau récupérées avec succès',
        schema: {
            example: [
                {
                    bureauSortieId: 1,
                    bureauName: 'Bureau Dakar',
                    bureauCode: 'BDS-001',
                    marchandises: [
                        {
                            natureMarchandise: 'Électronique',
                            totalColis: 65,
                            poidsTotal: 8000.5,
                            valeurTotale: 65000000,
                            poidsMoyen: 123.08,
                            valeurMoyenne: 1000000,
                            nombreOrdres: 25,
                            pourcentage: 20.5,
                        },
                    ],
                    totalColis: 317,
                },
            ],
        },
    })
    async getMarchandiseByBureau(
        @Query('dateDebut') dateDebut?: string,
        @Query('dateFin') dateFin?: string,
        @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    ) {
        return this.statisticsService.getMarchandiseByBureau({
            dateDebut,
            dateFin,
            limit,
        });
    }

    @Get('marchandises/trend')
    @ApiOperation({
        summary: 'Tendance des marchandises dans le temps',
        description:
            'Récupère l\'évolution des top marchandises par jour, semaine ou mois',
    })
    @ApiQuery({
        name: 'bureauSortieId',
        required: false,
        type: Number,
        description: 'ID du bureau de sortie',
        example: 1,
    })
    @ApiQuery({
        name: 'dateDebut',
        required: false,
        type: String,
        description: 'Date de début (format ISO)',
        example: '2024-01-01',
    })
    @ApiQuery({
        name: 'dateFin',
        required: false,
        type: String,
        description: 'Date de fin (format ISO)',
        example: '2024-12-31',
    })
    @ApiQuery({
        name: 'groupBy',
        required: false,
        enum: ['day', 'week', 'month'],
        description: 'Groupement des données',
        example: 'month',
    })
    @ApiQuery({
        name: 'topN',
        required: false,
        type: Number,
        description: 'Nombre de top marchandises à suivre',
        example: 5,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Tendance des marchandises récupérée avec succès',
        schema: {
            example: [
                {
                    period: '2024-01',
                    natureMarchandise: 'Électronique',
                    nombreColis: 45,
                    poidsTotal: 5420.5,
                    valeurTotale: 45000000,
                },
                {
                    period: '2024-01',
                    natureMarchandise: 'Textile',
                    nombreColis: 32,
                    poidsTotal: 2850.3,
                    valeurTotale: 15000000,
                },
            ],
        },
    })
    async getMarchandiseTrend(
        @Query('bureauSortieId', new ParseIntPipe({ optional: true }))
        bureauSortieId?: number,
        @Query('dateDebut') dateDebut?: string,
        @Query('dateFin') dateFin?: string,
        @Query('groupBy') groupBy?: 'day' | 'week' | 'month',
        @Query('topN', new ParseIntPipe({ optional: true })) topN?: number,
    ) {
        return this.statisticsService.getMarchandiseTrend({
            bureauSortieId,
            dateDebut,
            dateFin,
            groupBy,
            topN,
        });
    }

    @Get('marchandises/top')
    @ApiOperation({
        summary: 'Top marchandises les plus fréquentes',
        description:
            'Récupère les marchandises les plus transportées avec leurs statistiques',
    })
    @ApiQuery({
        name: 'bureauSortieId',
        required: false,
        type: Number,
        description: 'ID du bureau de sortie',
        example: 1,
    })
    @ApiQuery({
        name: 'dateDebut',
        required: false,
        type: String,
        description: 'Date de début (format ISO)',
        example: '2024-01-01',
    })
    @ApiQuery({
        name: 'dateFin',
        required: false,
        type: String,
        description: 'Date de fin (format ISO)',
        example: '2024-12-31',
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Nombre de résultats',
        example: 10,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Top marchandises récupérées avec succès',
        schema: {
            example: {
                topMarchandises: [
                    {
                        natureMarchandise: 'Électronique',
                        totalColis: 125,
                        poidsTotal: 15420.5,
                        valeurTotale: 125000000,
                        poidsMoyen: 123.36,
                        valeurMoyenne: 1000000,
                        nombreOrdres: 45,
                        pourcentage: 15.5,
                    },
                ],
                periode: {
                    debut: '2024-01-01T00:00:00.000Z',
                    fin: '2024-12-31T23:59:59.999Z',
                },
                bureauSortie: null,
            },
        },
    })
    async getTopMarchandises(
        @Query('bureauSortieId', new ParseIntPipe({ optional: true }))
        bureauSortieId?: number,
        @Query('dateDebut') dateDebut?: string,
        @Query('dateFin') dateFin?: string,
        @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    ) {
        return this.statisticsService.getTopMarchandises({
            bureauSortieId,
            dateDebut,
            dateFin,
            limit,
        });
    }

    @Get('destinations')
    @ApiOperation({
        summary: 'Statistiques par destination',
        description:
            'Récupère les statistiques des conteneurs et véhicules par destination',
    })
    @ApiQuery({
        name: 'bureauSortieId',
        required: false,
        type: Number,
        description: 'ID du bureau de sortie',
        example: 1,
    })
    @ApiQuery({
        name: 'dateDebut',
        required: false,
        type: String,
        description: 'Date de début (format ISO)',
        example: '2024-01-01',
    })
    @ApiQuery({
        name: 'dateFin',
        required: false,
        type: String,
        description: 'Date de fin (format ISO)',
        example: '2024-12-31',
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Nombre maximum de résultats',
        example: 20,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Statistiques des destinations récupérées avec succès',
        schema: {
            example: {
                destinations: [
                    {
                        destination: 'Port de Dakar',
                        totalConteneurs: 45,
                        totalCamions: 32,
                        totalVoitures: 18,
                        totalVehicules: 50,
                        totalTransports: 95,
                        nombreOrdres: 28,
                        pourcentage: 18.5,
                        moyenneConteneursParOrdre: 1.61,
                        moyenneVehiculesParOrdre: 1.79,
                    },
                    {
                        destination: 'Thiès',
                        totalConteneurs: 38,
                        totalCamions: 25,
                        totalVoitures: 12,
                        totalVehicules: 37,
                        totalTransports: 75,
                        nombreOrdres: 22,
                        pourcentage: 14.6,
                        moyenneConteneursParOrdre: 1.73,
                        moyenneVehiculesParOrdre: 1.68,
                    },
                ],
                totaux: {
                    totalOrdres: 156,
                    totalConteneurs: 312,
                    totalCamions: 245,
                    totalVoitures: 128,
                    totalVehicules: 373,
                    totalTransports: 685,
                    nombreDestinationsDistinctes: 12,
                },
                periode: {
                    debut: '2024-01-01T00:00:00.000Z',
                    fin: '2024-12-31T23:59:59.999Z',
                },
                bureauSortie: null,
            },
        },
    })
    async getDestinationStatistics(
        @Query('bureauSortieId', new ParseIntPipe({ optional: true }))
        bureauSortieId?: number,
        @Query('dateDebut') dateDebut?: string,
        @Query('dateFin') dateFin?: string,
        @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    ) {
        return this.statisticsService.getDestinationStatistics({
            bureauSortieId,
            dateDebut,
            dateFin,
            limit,
        });
    }

    @Get('destinations/by-bureau')
    @ApiOperation({
        summary: 'Statistiques des destinations par bureau',
        description:
            'Récupère les statistiques des destinations groupées par bureau de sortie',
    })
    @ApiQuery({
        name: 'dateDebut',
        required: false,
        type: String,
        description: 'Date de début (format ISO)',
        example: '2024-01-01',
    })
    @ApiQuery({
        name: 'dateFin',
        required: false,
        type: String,
        description: 'Date de fin (format ISO)',
        example: '2024-12-31',
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Nombre maximum de destinations par bureau',
        example: 10,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Statistiques par bureau récupérées avec succès',
        schema: {
            example: [
                {
                    bureauSortieId: 1,
                    bureauName: 'Bureau Dakar',
                    bureauCode: 'BDS-001',
                    destinations: [
                        {
                            destination: 'Port de Dakar',
                            totalConteneurs: 25,
                            totalCamions: 18,
                            totalVoitures: 10,
                            totalVehicules: 28,
                            totalTransports: 53,
                            nombreOrdres: 15,
                            pourcentage: 22.5,
                            moyenneConteneursParOrdre: 1.67,
                            moyenneVehiculesParOrdre: 1.87,
                        },
                    ],
                    totalTransports: 235,
                },
            ],
        },
    })
    async getDestinationByBureau(
        @Query('dateDebut') dateDebut?: string,
        @Query('dateFin') dateFin?: string,
        @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    ) {
        return this.statisticsService.getDestinationByBureau({
            dateDebut,
            dateFin,
            limit,
        });
    }

    @Get('destinations/trend')
    @ApiOperation({
        summary: 'Tendance des destinations dans le temps',
        description:
            'Récupère l\'évolution des top destinations par jour, semaine ou mois',
    })
    @ApiQuery({
        name: 'bureauSortieId',
        required: false,
        type: Number,
        description: 'ID du bureau de sortie',
        example: 1,
    })
    @ApiQuery({
        name: 'dateDebut',
        required: false,
        type: String,
        description: 'Date de début (format ISO)',
        example: '2024-01-01',
    })
    @ApiQuery({
        name: 'dateFin',
        required: false,
        type: String,
        description: 'Date de fin (format ISO)',
        example: '2024-12-31',
    })
    @ApiQuery({
        name: 'groupBy',
        required: false,
        enum: ['day', 'week', 'month'],
        description: 'Groupement des données',
        example: 'month',
    })
    @ApiQuery({
        name: 'topN',
        required: false,
        type: Number,
        description: 'Nombre de top destinations à suivre',
        example: 5,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Tendance des destinations récupérée avec succès',
        schema: {
            example: [
                {
                    period: '2024-01',
                    destination: 'Port de Dakar',
                    nombreConteneurs: 45,
                    nombreCamions: 32,
                    nombreVoitures: 18,
                    nombreVehicules: 50,
                    nombreTransports: 95,
                },
                {
                    period: '2024-01',
                    destination: 'Thiès',
                    nombreConteneurs: 38,
                    nombreCamions: 25,
                    nombreVoitures: 12,
                    nombreVehicules: 37,
                    nombreTransports: 75,
                },
            ],
        },
    })
    async getDestinationTrend(
        @Query('bureauSortieId', new ParseIntPipe({ optional: true }))
        bureauSortieId?: number,
        @Query('dateDebut') dateDebut?: string,
        @Query('dateFin') dateFin?: string,
        @Query('groupBy') groupBy?: 'day' | 'week' | 'month',
        @Query('topN', new ParseIntPipe({ optional: true })) topN?: number,
    ) {
        return this.statisticsService.getDestinationTrend({
            bureauSortieId,
            dateDebut,
            dateFin,
            groupBy,
            topN,
        });
    }

    @Get('destinations/top')
    @ApiOperation({
        summary: 'Top destinations les plus fréquentes',
        description:
            'Récupère les destinations les plus utilisées avec leurs statistiques',
    })
    @ApiQuery({
        name: 'bureauSortieId',
        required: false,
        type: Number,
        description: 'ID du bureau de sortie',
        example: 1,
    })
    @ApiQuery({
        name: 'dateDebut',
        required: false,
        type: String,
        description: 'Date de début (format ISO)',
        example: '2024-01-01',
    })
    @ApiQuery({
        name: 'dateFin',
        required: false,
        type: String,
        description: 'Date de fin (format ISO)',
        example: '2024-12-31',
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Nombre de résultats',
        example: 10,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Top destinations récupérées avec succès',
        schema: {
            example: {
                topDestinations: [
                    {
                        destination: 'Port de Dakar',
                        totalConteneurs: 45,
                        totalCamions: 32,
                        totalVoitures: 18,
                        totalVehicules: 50,
                        totalTransports: 95,
                        nombreOrdres: 28,
                        pourcentage: 18.5,
                        moyenneConteneursParOrdre: 1.61,
                        moyenneVehiculesParOrdre: 1.79,
                    },
                ],
                periode: {
                    debut: '2024-01-01T00:00:00.000Z',
                    fin: '2024-12-31T23:59:59.999Z',
                },
                bureauSortie: null,
            },
        },
    })
    async getTopDestinations(
        @Query('bureauSortieId', new ParseIntPipe({ optional: true }))
        bureauSortieId?: number,
        @Query('dateDebut') dateDebut?: string,
        @Query('dateFin') dateFin?: string,
        @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    ) {
        return this.statisticsService.getTopDestinations({
            bureauSortieId,
            dateDebut,
            dateFin,
            limit,
        });
    }

    @Get('routes')
    @ApiOperation({
        summary: 'Statistiques des itinéraires',
        description:
            'Récupère les statistiques des itinéraires les plus utilisés',
    })
    @ApiQuery({
        name: 'bureauSortieId',
        required: false,
        type: Number,
        description: 'ID du bureau de sortie',
        example: 1,
    })
    @ApiQuery({
        name: 'dateDebut',
        required: false,
        type: String,
        description: 'Date de début (format ISO)',
        example: '2024-01-01',
    })
    @ApiQuery({
        name: 'dateFin',
        required: false,
        type: String,
        description: 'Date de fin (format ISO)',
        example: '2024-12-31',
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Nombre de résultats',
        example: 20,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Statistiques des itinéraires récupérées avec succès',
        schema: {
            example: {
                routes: [
                    {
                        itineraire: 'Dakar -> Thiès -> Saint-Louis',
                        destination: 'Saint-Louis',
                        nombreOrdres: 15,
                        totalTransports: 45,
                        pourcentage: 8.5,
                    },
                    {
                        itineraire: 'Dakar -> Rufisque',
                        destination: 'Rufisque',
                        nombreOrdres: 12,
                        totalTransports: 38,
                        pourcentage: 7.2,
                    },
                ],
                periode: {
                    debut: '2024-01-01T00:00:00.000Z',
                    fin: '2024-12-31T23:59:59.999Z',
                },
                bureauSortie: null,
            },
        },
    })
    async getRouteStatistics(
        @Query('bureauSortieId', new ParseIntPipe({ optional: true }))
        bureauSortieId?: number,
        @Query('dateDebut') dateDebut?: string,
        @Query('dateFin') dateFin?: string,
        @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    ) {
        return this.statisticsService.getRouteStatistics({
            bureauSortieId,
            dateDebut,
            dateFin,
            limit,
        });
    }
}