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
exports.OrdreMissionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ordre_service_1 = require("./ordre.service");
const mission_dto_1 = require("../../libs/dto/ordre-mission/mission.dto");
const pagination_dto_1 = require("../../libs/dto/ordre-mission/pagination.dto");
const response_dto_1 = require("../../libs/dto/global/response.dto");
let OrdreMissionController = class OrdreMissionController {
    constructor(ordreMissionService) {
        this.ordreMissionService = ordreMissionService;
    }
    async create(createOrdreMissionDto) {
        return this.ordreMissionService.create(createOrdreMissionDto);
    }
    async findAll(paginationQuery) {
        return this.ordreMissionService.findAll(paginationQuery);
    }
    async findOne(id, includeRelations) {
        return this.ordreMissionService.findOne(id, includeRelations);
    }
    async getStatistics(id) {
        return this.ordreMissionService.getStatistics(id);
    }
    async update(id, updateOrdreMissionDto) {
        return this.ordreMissionService.update(id, updateOrdreMissionDto);
    }
    async remove(id) {
        return this.ordreMissionService.remove(id);
    }
};
exports.OrdreMissionController = OrdreMissionController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Créer un nouvel ordre de mission',
        description: 'Crée un nouvel ordre de mission avec possibilité d\'associer déclarations, colis, conteneurs, camions et voitures',
    }),
    (0, swagger_1.ApiBody)({ type: mission_dto_1.CreateOrdreMissionDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Ordre de mission créé avec succès',
        type: mission_dto_1.OrdreMissionResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Données invalides',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Un ordre avec ce numéro existe déjà',
        type: response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mission_dto_1.CreateOrdreMissionDto]),
    __metadata("design:returntype", Promise)
], OrdreMissionController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer tous les ordres de mission',
        description: 'Récupère une liste paginée de tous les ordres de mission avec filtres',
    }),
    (0, swagger_1.ApiQuery)({ type: pagination_dto_1.OrdreMissionPaginationQueryDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Liste des ordres de mission récupérée avec succès',
        schema: {
            example: {
                data: [
                    {
                        id: 1,
                        number: 2024001,
                        destination: 'Port de Dakar',
                        itinéraire: 'Dakar -> Thiès -> Saint-Louis',
                        dateOrdre: '2024-01-15T00:00:00.000Z',
                        depositaireId: 1,
                        maisonTransitId: 1,
                        createdById: 1,
                        statut: 'EN_COURS',
                        statutApurement: 'NON_APURE',
                        agentEscorteurId: 1,
                        bureauSortieId: 1,
                        observations: 'Mission prioritaire',
                        createdAt: '2024-01-15T10:30:00.000Z',
                        updatedAt: '2024-01-15T10:30:00.000Z',
                    },
                    {
                        id: 2,
                        number: 2024002,
                        destination: 'Aéroport Blaise Diagne',
                        itinéraire: 'Dakar -> AIBD',
                        dateOrdre: '2024-01-22T00:00:00.000Z',
                        depositaireId: 2,
                        maisonTransitId: null,
                        createdById: 1,
                        statut: 'EN_COURS',
                        statutApurement: 'NON_APURE',
                        agentEscorteurId: 2,
                        bureauSortieId: 1,
                        observations: null,
                        createdAt: '2024-01-20T10:30:00.000Z',
                        updatedAt: '2024-01-22T08:15:00.000Z',
                    },
                ],
                meta: {
                    page: 1,
                    limit: 10,
                    total: 50,
                    totalPages: 5,
                    hasNext: true,
                    hasPrevious: false,
                },
            },
        },
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.OrdreMissionPaginationQueryDto]),
    __metadata("design:returntype", Promise)
], OrdreMissionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer un ordre de mission par ID',
        description: 'Récupère les détails d\'un ordre de mission avec toutes ses relations',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID de l\'ordre de mission',
        type: Number,
        example: 1,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'includeRelations',
        required: false,
        description: 'Inclure toutes les relations (dépositaire, maison transit, agent escorteur, bureau sortie, déclarations, colis, conteneurs, camions, voitures)',
        type: Boolean,
        example: false,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Ordre de mission récupéré avec succès',
        type: mission_dto_1.OrdreMissionWithRelationsDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Ordre de mission non trouvé',
        type: response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('includeRelations', new common_1.ParseBoolPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Boolean]),
    __metadata("design:returntype", Promise)
], OrdreMissionController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/statistics'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer les statistiques d\'un ordre de mission',
        description: 'Récupère le nombre de déclarations, colis, conteneurs, camions et voitures associés',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID de l\'ordre de mission',
        type: Number,
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Statistiques récupérées avec succès',
        schema: {
            example: {
                ordreMissionId: 1,
                totalDeclarations: 5,
                totalColis: 12,
                totalConteneurs: 3,
                totalCamions: 2,
                totalVoitures: 1,
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Ordre de mission non trouvé',
        type: response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrdreMissionController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Mettre à jour un ordre de mission',
        description: 'Met à jour les informations d\'un ordre de mission',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID de l\'ordre de mission',
        type: Number,
        example: 1,
    }),
    (0, swagger_1.ApiBody)({ type: mission_dto_1.UpdateOrdreMissionDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Ordre de mission mis à jour avec succès',
        type: mission_dto_1.OrdreMissionResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Données invalides',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Ordre de mission non trouvé',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Un ordre avec ce numéro existe déjà',
        type: response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, mission_dto_1.UpdateOrdreMissionDto]),
    __metadata("design:returntype", Promise)
], OrdreMissionController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Supprimer un ordre de mission',
        description: 'Supprime un ordre de mission (soft delete)',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID de l\'ordre de mission',
        type: Number,
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Ordre de mission supprimé avec succès',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Ordre de mission non trouvé',
        type: response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrdreMissionController.prototype, "remove", null);
exports.OrdreMissionController = OrdreMissionController = __decorate([
    (0, swagger_1.ApiTags)('Ordres de Mission'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('ordres-mission'),
    __metadata("design:paramtypes", [ordre_service_1.OrdreMissionService])
], OrdreMissionController);
//# sourceMappingURL=ordre.controller.js.map