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
exports.EscouadeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const escouade_service_1 = require("./escouade.service");
const escouade_dto_1 = require("../../libs/dto/escouade/escouade.dto");
const pagination_dto_1 = require("../../libs/dto/escouade/pagination.dto");
const response_dto_1 = require("../../libs/dto/global/response.dto");
let EscouadeController = class EscouadeController {
    constructor(escouadeService) {
        this.escouadeService = escouadeService;
    }
    async create(createEscouadeDto) {
        return this.escouadeService.create(createEscouadeDto);
    }
    async findAll(paginationQuery) {
        return this.escouadeService.findAll(paginationQuery);
    }
    async findOne(id) {
        return this.escouadeService.findOne(id);
    }
    async getStatistics(id) {
        return this.escouadeService.getStatistics(id);
    }
    async update(id, updateEscouadeDto) {
        return this.escouadeService.update(id, updateEscouadeDto);
    }
    async addAgent(id, addAgentDto) {
        await this.escouadeService.addAgent(id, addAgentDto.agentId);
        return {
            success: true,
            message: 'Agent ajouté à l\'escouade avec succès',
        };
    }
    async removeAgent(id, agentId) {
        await this.escouadeService.removeAgent(id, agentId);
        return {
            success: true,
            message: 'Agent retiré de l\'escouade avec succès',
        };
    }
    async assignChef(id, chefId) {
        const escouade = await this.escouadeService.assignChef(id, chefId);
        return {
            success: true,
            message: 'Chef assigné avec succès',
            data: escouade,
        };
    }
    async assignAdjoint(id, adjointId) {
        const escouade = await this.escouadeService.assignAdjoint(id, adjointId);
        return {
            success: true,
            message: 'Adjoint assigné avec succès',
            data: escouade,
        };
    }
    async remove(id) {
        return this.escouadeService.remove(id);
    }
};
exports.EscouadeController = EscouadeController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Créer une nouvelle escouade',
        description: 'Crée une nouvelle escouade d\'agents dans le système',
    }),
    (0, swagger_1.ApiBody)({ type: escouade_dto_1.CreateEscouadeDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Escouade créée avec succès',
        type: escouade_dto_1.EscouadeResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Données invalides',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Une escouade avec ce nom existe déjà',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [escouade_dto_1.CreateEscouadeDto]),
    __metadata("design:returntype", Promise)
], EscouadeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer toutes les escouades',
        description: 'Récupère une liste paginée de toutes les escouades avec filtres optionnels',
    }),
    (0, swagger_1.ApiQuery)({ type: pagination_dto_1.EscouadePaginationQueryDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Liste des escouades récupérée avec succès',
        type: (response_dto_1.PaginatedResponseDto),
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.EscouadePaginationQueryDto]),
    __metadata("design:returntype", Promise)
], EscouadeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer une escouade par ID',
        description: 'Récupère les détails d\'une escouade spécifique par son ID',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID de l\'escouade',
        type: Number,
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Escouade récupérée avec succès',
        type: escouade_dto_1.EscouadeWithRelationsDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Escouade non trouvée',
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
], EscouadeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/statistics'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer les statistiques d\'une escouade',
        description: 'Récupère les statistiques (nombre d\'agents) d\'une escouade',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID de l\'escouade',
        type: Number,
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Statistiques récupérées avec succès',
        schema: {
            example: {
                escouadeId: 1,
                totalAgents: 12,
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Escouade non trouvée',
        type: response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EscouadeController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Mettre à jour une escouade',
        description: 'Met à jour les informations d\'une escouade existante',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID de l\'escouade à mettre à jour',
        type: Number,
        example: 1,
    }),
    (0, swagger_1.ApiBody)({ type: escouade_dto_1.UpdateEscouadeDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Escouade mise à jour avec succès',
        type: escouade_dto_1.EscouadeResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Données invalides',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Escouade non trouvée',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Une escouade avec ce nom existe déjà',
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
    __metadata("design:paramtypes", [Number, escouade_dto_1.UpdateEscouadeDto]),
    __metadata("design:returntype", Promise)
], EscouadeController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/agents'),
    (0, swagger_1.ApiOperation)({
        summary: 'Ajouter un agent à l\'escouade',
        description: 'Ajoute un agent comme membre de l\'escouade',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID de l\'escouade',
        type: Number,
        example: 1,
    }),
    (0, swagger_1.ApiBody)({ type: escouade_dto_1.AddAgentToEscouadeDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Agent ajouté avec succès',
        type: response_dto_1.SuccessResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Escouade ou agent non trouvé',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'L\'agent est déjà membre de cette escouade',
        type: response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, escouade_dto_1.AddAgentToEscouadeDto]),
    __metadata("design:returntype", Promise)
], EscouadeController.prototype, "addAgent", null);
__decorate([
    (0, common_1.Delete)(':id/agents/:agentId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Retirer un agent de l\'escouade',
        description: 'Retire un agent des membres de l\'escouade',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID de l\'escouade',
        type: Number,
        example: 1,
    }),
    (0, swagger_1.ApiParam)({
        name: 'agentId',
        description: 'ID de l\'agent à retirer',
        type: Number,
        example: 5,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Agent retiré avec succès',
        type: response_dto_1.SuccessResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Escouade non trouvée ou agent pas membre',
        type: response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('agentId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], EscouadeController.prototype, "removeAgent", null);
__decorate([
    (0, common_1.Put)(':id/chef/:chefId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Assigner un chef à l\'escouade',
        description: 'Assigne ou modifie le chef de l\'escouade',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID de l\'escouade',
        type: Number,
        example: 1,
    }),
    (0, swagger_1.ApiParam)({
        name: 'chefId',
        description: 'ID de l\'agent à assigner comme chef',
        type: Number,
        example: 3,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Chef assigné avec succès',
        type: (response_dto_1.SuccessResponseDto),
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Escouade ou agent non trouvé',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Le chef ne peut pas être le même que l\'adjoint',
        type: response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('chefId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], EscouadeController.prototype, "assignChef", null);
__decorate([
    (0, common_1.Put)(':id/adjoint/:adjointId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Assigner un adjoint à l\'escouade',
        description: 'Assigne ou modifie l\'adjoint du chef de l\'escouade',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID de l\'escouade',
        type: Number,
        example: 1,
    }),
    (0, swagger_1.ApiParam)({
        name: 'adjointId',
        description: 'ID de l\'agent à assigner comme adjoint',
        type: Number,
        example: 4,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Adjoint assigné avec succès',
        type: (response_dto_1.SuccessResponseDto),
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Escouade ou agent non trouvé',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'L\'adjoint ne peut pas être le même que le chef',
        type: response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('adjointId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], EscouadeController.prototype, "assignAdjoint", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Supprimer une escouade',
        description: 'Supprime une escouade du système (soft delete)',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID de l\'escouade à supprimer',
        type: Number,
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Escouade supprimée avec succès',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Escouade non trouvée',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Impossible de supprimer: escouade contient des agents',
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
], EscouadeController.prototype, "remove", null);
exports.EscouadeController = EscouadeController = __decorate([
    (0, swagger_1.ApiTags)('Escouades'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('escouades'),
    __metadata("design:paramtypes", [escouade_service_1.EscouadeService])
], EscouadeController);
//# sourceMappingURL=escouade.controller.js.map