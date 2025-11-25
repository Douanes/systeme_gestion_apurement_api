"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const statistics_service_1 = require("./statistics.service");
const apurement_statistics_dto_1 = require("../../libs/dto/statistics/apurement-statistics.dto");
let StatisticsController = class StatisticsController {
    constructor(statisticsService) {
        this.statisticsService = statisticsService;
    }
    async getApurementStatistics(query) {
        return this.statisticsService.getApurementStatistics(query);
    }
    async getApurementByBureau(query) {
        return this.statisticsService.getApurementByBureau(query);
    }
    async getApurementTrend(bureauSortieId, dateDebut, dateFin, period, groupBy) {
        return this.statisticsService.getApurementTrend({
            bureauSortieId,
            dateDebut,
            dateFin,
            period,
            groupBy,
        });
    }
    async getDashboardOverview(query) {
        return this.statisticsService.getDashboardOverview(query);
    }
    async getMarchandiseStatistics(bureauSortieId, dateDebut, dateFin, limit) {
        return this.statisticsService.getMarchandiseStatistics({
            bureauSortieId,
            dateDebut,
            dateFin,
            limit,
        });
    }
    async getMarchandiseByBureau(dateDebut, dateFin, limit) {
        return this.statisticsService.getMarchandiseByBureau({
            dateDebut,
            dateFin,
            limit,
        });
    }
    async getMarchandiseTrend(bureauSortieId, dateDebut, dateFin, groupBy, topN) {
        return this.statisticsService.getMarchandiseTrend({
            bureauSortieId,
            dateDebut,
            dateFin,
            groupBy,
            topN,
        });
    }
    async getTopMarchandises(bureauSortieId, dateDebut, dateFin, limit) {
        return this.statisticsService.getTopMarchandises({
            bureauSortieId,
            dateDebut,
            dateFin,
            limit,
        });
    }
    async getDestinationStatistics(bureauSortieId, dateDebut, dateFin, limit) {
        return this.statisticsService.getDestinationStatistics({
            bureauSortieId,
            dateDebut,
            dateFin,
            limit,
        });
    }
    async getDestinationByBureau(dateDebut, dateFin, limit) {
        return this.statisticsService.getDestinationByBureau({
            dateDebut,
            dateFin,
            limit,
        });
    }
    async getDestinationTrend(bureauSortieId, dateDebut, dateFin, groupBy, topN) {
        return this.statisticsService.getDestinationTrend({
            bureauSortieId,
            dateDebut,
            dateFin,
            groupBy,
            topN,
        });
    }
    async getTopDestinations(bureauSortieId, dateDebut, dateFin, limit) {
        return this.statisticsService.getTopDestinations({
            bureauSortieId,
            dateDebut,
            dateFin,
            limit,
        });
    }
    async getRouteStatistics(bureauSortieId, dateDebut, dateFin, limit) {
        return this.statisticsService.getRouteStatistics({
            bureauSortieId,
            dateDebut,
            dateFin,
            limit,
        });
    }
};
exports.StatisticsController = StatisticsController;
__decorate([
    (0, common_1.Get)('apurement'),
    (0, swagger_1.ApiOperation)({
        summary: 'Statistiques d\'apurement globales',
        description: 'Récupère les statistiques d\'apurement (apurés, non apurés, rejetés) avec filtres par période et bureau',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'bureauSortieId',
        required: false,
        type: Number,
        description: 'ID du bureau de sortie',
        example: 1,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateDebut',
        required: false,
        type: String,
        description: 'Date de début (format ISO)',
        example: '2024-01-01',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateFin',
        required: false,
        type: String,
        description: 'Date de fin (format ISO)',
        example: '2024-12-31',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'period',
        required: false,
        enum: apurement_statistics_dto_1.PeriodFilter,
        description: 'Période prédéfinie',
        example: apurement_statistics_dto_1.PeriodFilter.THIS_MONTH,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Statistiques d\'apurement récupérées avec succès',
        type: apurement_statistics_dto_1.ApurementStatisticsResponseDto,
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
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [apurement_statistics_dto_1.ApurementStatisticsQueryDto]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getApurementStatistics", null);
__decorate([
    (0, common_1.Get)('apurement/by-bureau'),
    (0, swagger_1.ApiOperation)({
        summary: 'Statistiques d\'apurement par bureau de sortie',
        description: 'Récupère les statistiques d\'apurement groupées par bureau de sortie',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateDebut',
        required: false,
        type: String,
        description: 'Date de début (format ISO)',
        example: '2024-01-01',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateFin',
        required: false,
        type: String,
        description: 'Date de fin (format ISO)',
        example: '2024-12-31',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'period',
        required: false,
        enum: apurement_statistics_dto_1.PeriodFilter,
        description: 'Période prédéfinie',
        example: apurement_statistics_dto_1.PeriodFilter.THIS_MONTH,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Statistiques par bureau récupérées avec succès',
        type: [apurement_statistics_dto_1.ApurementByBureauResponseDto],
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
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [apurement_statistics_dto_1.ApurementStatisticsQueryDto]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getApurementByBureau", null);
__decorate([
    (0, common_1.Get)('apurement/trend'),
    (0, swagger_1.ApiOperation)({
        summary: 'Tendance d\'apurement dans le temps',
        description: 'Récupère l\'évolution des statistiques d\'apurement par jour, semaine ou mois',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'bureauSortieId',
        required: false,
        type: Number,
        description: 'ID du bureau de sortie',
        example: 1,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateDebut',
        required: false,
        type: String,
        description: 'Date de début (format ISO)',
        example: '2024-01-01',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateFin',
        required: false,
        type: String,
        description: 'Date de fin (format ISO)',
        example: '2024-12-31',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'period',
        required: false,
        enum: apurement_statistics_dto_1.PeriodFilter,
        description: 'Période prédéfinie',
        example: apurement_statistics_dto_1.PeriodFilter.THIS_YEAR,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'groupBy',
        required: false,
        enum: ['day', 'week', 'month'],
        description: 'Groupement des données',
        example: 'month',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Tendance d\'apurement récupérée avec succès',
        type: [apurement_statistics_dto_1.ApurementTrendResponseDto],
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
    }),
    __param(0, (0, common_1.Query)('bureauSortieId', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('dateDebut')),
    __param(2, (0, common_1.Query)('dateFin')),
    __param(3, (0, common_1.Query)('period')),
    __param(4, (0, common_1.Query)('groupBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String, String]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getApurementTrend", null);
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({
        summary: 'Vue d\'ensemble du dashboard',
        description: 'Récupère un aperçu complet avec comparaison période précédente et top/bottom bureaux',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'bureauSortieId',
        required: false,
        type: Number,
        description: 'ID du bureau de sortie',
        example: 1,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'period',
        required: false,
        enum: apurement_statistics_dto_1.PeriodFilter,
        description: 'Période prédéfinie',
        example: apurement_statistics_dto_1.PeriodFilter.THIS_MONTH,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
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
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [apurement_statistics_dto_1.ApurementStatisticsQueryDto]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getDashboardOverview", null);
__decorate([
    (0, common_1.Get)('marchandises'),
    (0, swagger_1.ApiOperation)({
        summary: 'Statistiques par nature de marchandise',
        description: 'Récupère les statistiques détaillées pour chaque type de marchandise (colis)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'bureauSortieId',
        required: false,
        type: Number,
        description: 'ID du bureau de sortie',
        example: 1,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateDebut',
        required: false,
        type: String,
        description: 'Date de début (format ISO)',
        example: '2024-01-01',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateFin',
        required: false,
        type: String,
        description: 'Date de fin (format ISO)',
        example: '2024-12-31',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Nombre maximum de résultats',
        example: 20,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
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
    }),
    __param(0, (0, common_1.Query)('bureauSortieId', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('dateDebut')),
    __param(2, (0, common_1.Query)('dateFin')),
    __param(3, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, Number]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getMarchandiseStatistics", null);
__decorate([
    (0, common_1.Get)('marchandises/by-bureau'),
    (0, swagger_1.ApiOperation)({
        summary: 'Statistiques des marchandises par bureau',
        description: 'Récupère les statistiques des marchandises groupées par bureau de sortie',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateDebut',
        required: false,
        type: String,
        description: 'Date de début (format ISO)',
        example: '2024-01-01',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateFin',
        required: false,
        type: String,
        description: 'Date de fin (format ISO)',
        example: '2024-12-31',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Nombre maximum de marchandises par bureau',
        example: 10,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
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
    }),
    __param(0, (0, common_1.Query)('dateDebut')),
    __param(1, (0, common_1.Query)('dateFin')),
    __param(2, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getMarchandiseByBureau", null);
__decorate([
    (0, common_1.Get)('marchandises/trend'),
    (0, swagger_1.ApiOperation)({
        summary: 'Tendance des marchandises dans le temps',
        description: 'Récupère l\'évolution des top marchandises par jour, semaine ou mois',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'bureauSortieId',
        required: false,
        type: Number,
        description: 'ID du bureau de sortie',
        example: 1,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateDebut',
        required: false,
        type: String,
        description: 'Date de début (format ISO)',
        example: '2024-01-01',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateFin',
        required: false,
        type: String,
        description: 'Date de fin (format ISO)',
        example: '2024-12-31',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'groupBy',
        required: false,
        enum: ['day', 'week', 'month'],
        description: 'Groupement des données',
        example: 'month',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'topN',
        required: false,
        type: Number,
        description: 'Nombre de top marchandises à suivre',
        example: 5,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
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
    }),
    __param(0, (0, common_1.Query)('bureauSortieId', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('dateDebut')),
    __param(2, (0, common_1.Query)('dateFin')),
    __param(3, (0, common_1.Query)('groupBy')),
    __param(4, (0, common_1.Query)('topN', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String, Number]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getMarchandiseTrend", null);
__decorate([
    (0, common_1.Get)('marchandises/top'),
    (0, swagger_1.ApiOperation)({
        summary: 'Top marchandises les plus fréquentes',
        description: 'Récupère les marchandises les plus transportées avec leurs statistiques',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'bureauSortieId',
        required: false,
        type: Number,
        description: 'ID du bureau de sortie',
        example: 1,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateDebut',
        required: false,
        type: String,
        description: 'Date de début (format ISO)',
        example: '2024-01-01',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateFin',
        required: false,
        type: String,
        description: 'Date de fin (format ISO)',
        example: '2024-12-31',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Nombre de résultats',
        example: 10,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
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
    }),
    __param(0, (0, common_1.Query)('bureauSortieId', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('dateDebut')),
    __param(2, (0, common_1.Query)('dateFin')),
    __param(3, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, Number]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getTopMarchandises", null);
__decorate([
    (0, common_1.Get)('destinations'),
    (0, swagger_1.ApiOperation)({
        summary: 'Statistiques par destination',
        description: 'Récupère les statistiques des conteneurs et véhicules par destination',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'bureauSortieId',
        required: false,
        type: Number,
        description: 'ID du bureau de sortie',
        example: 1,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateDebut',
        required: false,
        type: String,
        description: 'Date de début (format ISO)',
        example: '2024-01-01',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateFin',
        required: false,
        type: String,
        description: 'Date de fin (format ISO)',
        example: '2024-12-31',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Nombre maximum de résultats',
        example: 20,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
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
    }),
    __param(0, (0, common_1.Query)('bureauSortieId', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('dateDebut')),
    __param(2, (0, common_1.Query)('dateFin')),
    __param(3, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, Number]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getDestinationStatistics", null);
__decorate([
    (0, common_1.Get)('destinations/by-bureau'),
    (0, swagger_1.ApiOperation)({
        summary: 'Statistiques des destinations par bureau',
        description: 'Récupère les statistiques des destinations groupées par bureau de sortie',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateDebut',
        required: false,
        type: String,
        description: 'Date de début (format ISO)',
        example: '2024-01-01',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateFin',
        required: false,
        type: String,
        description: 'Date de fin (format ISO)',
        example: '2024-12-31',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Nombre maximum de destinations par bureau',
        example: 10,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
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
    }),
    __param(0, (0, common_1.Query)('dateDebut')),
    __param(1, (0, common_1.Query)('dateFin')),
    __param(2, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getDestinationByBureau", null);
__decorate([
    (0, common_1.Get)('destinations/trend'),
    (0, swagger_1.ApiOperation)({
        summary: 'Tendance des destinations dans le temps',
        description: 'Récupère l\'évolution des top destinations par jour, semaine ou mois',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'bureauSortieId',
        required: false,
        type: Number,
        description: 'ID du bureau de sortie',
        example: 1,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateDebut',
        required: false,
        type: String,
        description: 'Date de début (format ISO)',
        example: '2024-01-01',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateFin',
        required: false,
        type: String,
        description: 'Date de fin (format ISO)',
        example: '2024-12-31',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'groupBy',
        required: false,
        enum: ['day', 'week', 'month'],
        description: 'Groupement des données',
        example: 'month',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'topN',
        required: false,
        type: Number,
        description: 'Nombre de top destinations à suivre',
        example: 5,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
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
    }),
    __param(0, (0, common_1.Query)('bureauSortieId', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('dateDebut')),
    __param(2, (0, common_1.Query)('dateFin')),
    __param(3, (0, common_1.Query)('groupBy')),
    __param(4, (0, common_1.Query)('topN', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String, Number]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getDestinationTrend", null);
__decorate([
    (0, common_1.Get)('destinations/top'),
    (0, swagger_1.ApiOperation)({
        summary: 'Top destinations les plus fréquentes',
        description: 'Récupère les destinations les plus utilisées avec leurs statistiques',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'bureauSortieId',
        required: false,
        type: Number,
        description: 'ID du bureau de sortie',
        example: 1,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateDebut',
        required: false,
        type: String,
        description: 'Date de début (format ISO)',
        example: '2024-01-01',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateFin',
        required: false,
        type: String,
        description: 'Date de fin (format ISO)',
        example: '2024-12-31',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Nombre de résultats',
        example: 10,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
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
    }),
    __param(0, (0, common_1.Query)('bureauSortieId', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('dateDebut')),
    __param(2, (0, common_1.Query)('dateFin')),
    __param(3, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, Number]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getTopDestinations", null);
__decorate([
    (0, common_1.Get)('routes'),
    (0, swagger_1.ApiOperation)({
        summary: 'Statistiques des itinéraires',
        description: 'Récupère les statistiques des itinéraires les plus utilisés',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'bureauSortieId',
        required: false,
        type: Number,
        description: 'ID du bureau de sortie',
        example: 1,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateDebut',
        required: false,
        type: String,
        description: 'Date de début (format ISO)',
        example: '2024-01-01',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateFin',
        required: false,
        type: String,
        description: 'Date de fin (format ISO)',
        example: '2024-12-31',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Nombre de résultats',
        example: 20,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
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
    }),
    __param(0, (0, common_1.Query)('bureauSortieId', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('dateDebut')),
    __param(2, (0, common_1.Query)('dateFin')),
    __param(3, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, Number]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getRouteStatistics", null);
exports.StatisticsController = StatisticsController = __decorate([
    (0, swagger_1.ApiTags)('Statistiques & Rapports'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('statistics'),
    __metadata("design:paramtypes", [statistics_service_1.StatisticsService])
], StatisticsController);
//# sourceMappingURL=statistics.controller.js.map