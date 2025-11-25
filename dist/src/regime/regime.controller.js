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
exports.RegimeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const regime_service_1 = require("./regime.service");
const regime_dto_1 = require("../../libs/dto/regime/regime.dto");
const pagination_dto_1 = require("../../libs/dto/global/pagination.dto");
const response_dto_1 = require("../../libs/dto/global/response.dto");
let RegimeController = class RegimeController {
    constructor(regimeService) {
        this.regimeService = regimeService;
    }
    async create(createRegimeDto) {
        return this.regimeService.create(createRegimeDto);
    }
    async findAll(paginationQuery) {
        return this.regimeService.findAll(paginationQuery);
    }
    async findAllSimple() {
        return this.regimeService.findAllSimple();
    }
    async findOne(id) {
        return this.regimeService.findOne(id);
    }
    async update(id, updateRegimeDto) {
        return this.regimeService.update(id, updateRegimeDto);
    }
    async remove(id) {
        return this.regimeService.remove(id);
    }
};
exports.RegimeController = RegimeController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Créer un nouveau régime douanier',
        description: 'Crée un nouveau régime douanier dans le système',
    }),
    (0, swagger_1.ApiBody)({ type: regime_dto_1.CreateRegimeDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Régime créé avec succès',
        type: regime_dto_1.RegimeResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Données invalides',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Un régime avec ce nom existe déjà',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [regime_dto_1.CreateRegimeDto]),
    __metadata("design:returntype", Promise)
], RegimeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer tous les régimes',
        description: 'Récupère une liste paginée de tous les régimes douaniers avec filtres optionnels',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Liste des régimes récupérée avec succès',
        type: (response_dto_1.PaginatedResponseDto),
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", Promise)
], RegimeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer tous les régimes (sans pagination)',
        description: 'Récupère tous les régimes disponibles - utile pour les listes déroulantes',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Liste complète des régimes',
        type: [regime_dto_1.RegimeResponseDto],
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: response_dto_1.ErrorResponseDto,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RegimeController.prototype, "findAllSimple", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer un régime par ID',
        description: 'Récupère les détails d\'un régime spécifique par son ID',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID du régime',
        type: Number,
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Régime récupéré avec succès',
        type: regime_dto_1.RegimeResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Régime non trouvé',
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
], RegimeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Mettre à jour un régime',
        description: 'Met à jour les informations d\'un régime existant',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID du régime à mettre à jour',
        type: Number,
        example: 1,
    }),
    (0, swagger_1.ApiBody)({ type: regime_dto_1.UpdateRegimeDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Régime mis à jour avec succès',
        type: regime_dto_1.RegimeResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Données invalides',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Régime non trouvé',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Un régime avec ce nom existe déjà',
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
    __metadata("design:paramtypes", [Number, regime_dto_1.UpdateRegimeDto]),
    __metadata("design:returntype", Promise)
], RegimeController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Supprimer un régime',
        description: 'Supprime un régime du système (soft delete)',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID du régime à supprimer',
        type: Number,
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Régime supprimé avec succès',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Régime non trouvé',
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
], RegimeController.prototype, "remove", null);
exports.RegimeController = RegimeController = __decorate([
    (0, swagger_1.ApiTags)('Régimes'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('regimes'),
    __metadata("design:paramtypes", [regime_service_1.RegimeService])
], RegimeController);
//# sourceMappingURL=regime.controller.js.map