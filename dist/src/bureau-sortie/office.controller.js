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
exports.BureauSortieController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const office_service_1 = require("./office.service");
const office_dto_1 = require("../../libs/dto/bureau-sortie/office.dto");
const pagination_dto_1 = require("../../libs/dto/bureau-sortie/pagination.dto");
const response_dto_1 = require("../../libs/dto/global/response.dto");
let BureauSortieController = class BureauSortieController {
    constructor(bureauSortieService) {
        this.bureauSortieService = bureauSortieService;
    }
    async create(createBureauSortieDto) {
        return this.bureauSortieService.create(createBureauSortieDto);
    }
    async findAll(paginationQuery) {
        return this.bureauSortieService.findAll(paginationQuery);
    }
    async findAllActive() {
        return this.bureauSortieService.findAllActive();
    }
    async findOne(id) {
        return this.bureauSortieService.findOne(id);
    }
    async getStatistics(id) {
        return this.bureauSortieService.getStatistics(id);
    }
    async update(id, updateBureauSortieDto) {
        return this.bureauSortieService.update(id, updateBureauSortieDto);
    }
    async activate(id) {
        const bureau = await this.bureauSortieService.activate(id);
        return {
            success: true,
            message: 'Bureau de sortie activé avec succès',
            data: bureau,
        };
    }
    async deactivate(id) {
        const bureau = await this.bureauSortieService.deactivate(id);
        return {
            success: true,
            message: 'Bureau de sortie désactivé avec succès',
            data: bureau,
        };
    }
    async remove(id) {
        return this.bureauSortieService.remove(id);
    }
};
exports.BureauSortieController = BureauSortieController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Créer un nouveau bureau de sortie',
        description: 'Crée un nouveau bureau de sortie frontalier dans le système',
    }),
    (0, swagger_1.ApiBody)({ type: office_dto_1.CreateBureauSortieDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Bureau de sortie créé avec succès',
        type: office_dto_1.BureauSortieResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Données invalides',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Un bureau avec ce code existe déjà',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [office_dto_1.CreateBureauSortieDto]),
    __metadata("design:returntype", Promise)
], BureauSortieController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer tous les bureaux de sortie',
        description: 'Récupère une liste paginée de tous les bureaux de sortie avec filtres optionnels',
    }),
    (0, swagger_1.ApiQuery)({ type: pagination_dto_1.BureauSortiePaginationQueryDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Liste des bureaux de sortie récupérée avec succès',
        type: (response_dto_1.PaginatedResponseDto),
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.BureauSortiePaginationQueryDto]),
    __metadata("design:returntype", Promise)
], BureauSortieController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer tous les bureaux actifs (sans pagination)',
        description: 'Récupère tous les bureaux de sortie actifs - utile pour les listes déroulantes',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Liste complète des bureaux actifs',
        type: [office_dto_1.BureauSortieResponseDto],
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: response_dto_1.ErrorResponseDto,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BureauSortieController.prototype, "findAllActive", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer un bureau de sortie par ID',
        description: 'Récupère les détails d\'un bureau de sortie spécifique par son ID',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID du bureau de sortie',
        type: Number,
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Bureau de sortie récupéré avec succès',
        type: office_dto_1.BureauSortieWithRelationsDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Bureau de sortie non trouvé',
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
], BureauSortieController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/statistics'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer les statistiques d\'un bureau',
        description: 'Récupère les statistiques (nombre de déclarations, agents, ordres de mission) d\'un bureau',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID du bureau de sortie',
        type: Number,
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Statistiques récupérées avec succès',
        schema: {
            example: {
                bureauId: 1,
                totalDeclarations: 150,
                totalAgents: 8,
                totalOrdreMissions: 45,
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Bureau non trouvé',
        type: response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BureauSortieController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Mettre à jour un bureau de sortie',
        description: 'Met à jour les informations d\'un bureau de sortie existant',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID du bureau de sortie à mettre à jour',
        type: Number,
        example: 1,
    }),
    (0, swagger_1.ApiBody)({ type: office_dto_1.UpdateBureauSortieDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Bureau de sortie mis à jour avec succès',
        type: office_dto_1.BureauSortieResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Données invalides',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Bureau de sortie non trouvé',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Un bureau avec ce code existe déjà',
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
    __metadata("design:paramtypes", [Number, office_dto_1.UpdateBureauSortieDto]),
    __metadata("design:returntype", Promise)
], BureauSortieController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/activate'),
    (0, swagger_1.ApiOperation)({
        summary: 'Activer un bureau de sortie',
        description: 'Active un bureau de sortie désactivé',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID du bureau de sortie',
        type: Number,
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Bureau activé avec succès',
        type: (response_dto_1.SuccessResponseDto),
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Bureau non trouvé',
        type: response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BureauSortieController.prototype, "activate", null);
__decorate([
    (0, common_1.Put)(':id/deactivate'),
    (0, swagger_1.ApiOperation)({
        summary: 'Désactiver un bureau de sortie',
        description: 'Désactive un bureau de sortie actif',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID du bureau de sortie',
        type: Number,
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Bureau désactivé avec succès',
        type: (response_dto_1.SuccessResponseDto),
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Bureau non trouvé',
        type: response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BureauSortieController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Supprimer un bureau de sortie',
        description: 'Supprime un bureau de sortie du système (soft delete)',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID du bureau de sortie à supprimer',
        type: Number,
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Bureau de sortie supprimé avec succès',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Bureau de sortie non trouvé',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Impossible de supprimer: bureau associé à des déclarations, agents ou ordres de mission',
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
], BureauSortieController.prototype, "remove", null);
exports.BureauSortieController = BureauSortieController = __decorate([
    (0, swagger_1.ApiTags)('Bureaux de Sortie'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('bureaux-sortie'),
    __metadata("design:paramtypes", [office_service_1.BureauSortieService])
], BureauSortieController);
//# sourceMappingURL=office.controller.js.map