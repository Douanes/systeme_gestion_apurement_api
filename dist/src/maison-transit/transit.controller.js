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
exports.MaisonTransitController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const transit_service_1 = require("./transit.service");
const transit_dto_1 = require("../../libs/dto/maison-transit/transit.dto");
const pagination_dto_1 = require("../../libs/dto/maison-transit/pagination.dto");
const response_dto_1 = require("../../libs/dto/global/response.dto");
let MaisonTransitController = class MaisonTransitController {
    constructor(maisonTransitService) {
        this.maisonTransitService = maisonTransitService;
    }
    async create(createMaisonTransitDto) {
        return this.maisonTransitService.create(createMaisonTransitDto);
    }
    async findAll(paginationQuery) {
        return this.maisonTransitService.findAll(paginationQuery);
    }
    async findOne(id) {
        return this.maisonTransitService.findOne(id);
    }
    async getStatistics(id) {
        return this.maisonTransitService.getStatistics(id);
    }
    async update(id, updateMaisonTransitDto) {
        return this.maisonTransitService.update(id, updateMaisonTransitDto);
    }
    async activate(id) {
        const maison = await this.maisonTransitService.activate(id);
        return {
            success: true,
            message: 'Maison de transit activée avec succès',
            data: maison,
        };
    }
    async deactivate(id) {
        const maison = await this.maisonTransitService.deactivate(id);
        return {
            success: true,
            message: 'Maison de transit désactivée avec succès',
            data: maison,
        };
    }
    async remove(id) {
        return this.maisonTransitService.remove(id);
    }
};
exports.MaisonTransitController = MaisonTransitController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Créer une nouvelle maison de transit',
        description: 'Crée une nouvelle maison de transit dans le système',
    }),
    (0, swagger_1.ApiBody)({ type: transit_dto_1.CreateMaisonTransitDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Maison de transit créée avec succès',
        type: transit_dto_1.MaisonTransitResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Données invalides',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Une maison de transit avec ce code existe déjà',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [transit_dto_1.CreateMaisonTransitDto]),
    __metadata("design:returntype", Promise)
], MaisonTransitController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer toutes les maisons de transit',
        description: 'Récupère une liste paginée de toutes les maisons de transit avec filtres optionnels',
    }),
    (0, swagger_1.ApiQuery)({ type: pagination_dto_1.MaisonTransitPaginationQueryDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Liste des maisons de transit récupérée avec succès',
        type: (response_dto_1.PaginatedResponseDto),
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.MaisonTransitPaginationQueryDto]),
    __metadata("design:returntype", Promise)
], MaisonTransitController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer une maison de transit par ID',
        description: 'Récupère les détails d\'une maison de transit spécifique par son ID',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID de la maison de transit',
        type: Number,
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Maison de transit récupérée avec succès',
        type: transit_dto_1.MaisonTransitWithRelationsDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Maison de transit non trouvée',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MaisonTransitController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/statistics'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer les statistiques d\'une maison de transit',
        description: 'Récupère les statistiques (nombre de dépositaires, déclarations) d\'une maison de transit',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID de la maison de transit',
        type: Number,
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Statistiques récupérées avec succès',
        schema: {
            example: {
                maisonTransitId: 1,
                totalDepositaires: 15,
                totalDeclarations: 120,
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Maison de transit non trouvée',
        type: response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MaisonTransitController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Mettre à jour une maison de transit',
        description: 'Met à jour les informations d\'une maison de transit existante',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID de la maison de transit à mettre à jour',
        type: Number,
        example: 1,
    }),
    (0, swagger_1.ApiBody)({ type: transit_dto_1.UpdateMaisonTransitDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Maison de transit mise à jour avec succès',
        type: transit_dto_1.MaisonTransitResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Données invalides',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Maison de transit non trouvée',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Une maison de transit avec ce code existe déjà',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, transit_dto_1.UpdateMaisonTransitDto]),
    __metadata("design:returntype", Promise)
], MaisonTransitController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/activate'),
    (0, swagger_1.ApiOperation)({
        summary: 'Activer une maison de transit',
        description: 'Active une maison de transit désactivée',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID de la maison de transit',
        type: Number,
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Maison de transit activée avec succès',
        type: (response_dto_1.SuccessResponseDto),
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Maison de transit non trouvée',
        type: response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MaisonTransitController.prototype, "activate", null);
__decorate([
    (0, common_1.Put)(':id/deactivate'),
    (0, swagger_1.ApiOperation)({
        summary: 'Désactiver une maison de transit',
        description: 'Désactive une maison de transit active',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID de la maison de transit',
        type: Number,
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Maison de transit désactivée avec succès',
        type: (response_dto_1.SuccessResponseDto),
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Maison de transit non trouvée',
        type: response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MaisonTransitController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Supprimer une maison de transit',
        description: 'Supprime une maison de transit du système (soft delete)',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID de la maison de transit à supprimer',
        type: Number,
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Maison de transit supprimée avec succès',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Maison de transit non trouvée',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Impossible de supprimer: maison de transit associée à des dépositaires ou déclarations',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MaisonTransitController.prototype, "remove", null);
exports.MaisonTransitController = MaisonTransitController = __decorate([
    (0, swagger_1.ApiTags)('Maisons de Transit'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('maisons-transit'),
    __metadata("design:paramtypes", [transit_service_1.MaisonTransitService])
], MaisonTransitController);
//# sourceMappingURL=transit.controller.js.map