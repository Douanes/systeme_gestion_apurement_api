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
exports.AgentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const agent_service_1 = require("./agent.service");
const agent_dto_1 = require("../../libs/dto/agent/agent.dto");
const pagination_dto_1 = require("../../libs/dto/agent/pagination.dto");
const response_dto_1 = require("../../libs/dto/global/response.dto");
const agent_detail_schema_1 = require("../../libs/schema/agent/agent-detail.schema");
const all_agent_dto_1 = require("../../libs/schema/agent/all-agent.dto");
let AgentController = class AgentController {
    constructor(agentService) {
        this.agentService = agentService;
    }
    async create(createAgentDto) {
        return this.agentService.create(createAgentDto);
    }
    async findAll(paginationQuery) {
        return this.agentService.findAll(paginationQuery);
    }
    async findOne(id) {
        return this.agentService.findOne(id);
    }
    async getStatistics(id) {
        return this.agentService.getStatistics(id);
    }
    async update(id, updateAgentDto) {
        return this.agentService.update(id, updateAgentDto);
    }
    async activate(id) {
        const agent = await this.agentService.activate(id);
        return {
            success: true,
            message: 'Agent activé avec succès',
            data: agent,
        };
    }
    async deactivate(id) {
        const agent = await this.agentService.deactivate(id);
        return {
            success: true,
            message: 'Agent désactivé avec succès',
            data: agent,
        };
    }
    async remove(id) {
        return this.agentService.remove(id);
    }
};
exports.AgentController = AgentController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Créer un nouvel agent',
        description: 'Crée un nouvel agent des douanes dans le système',
    }),
    (0, swagger_1.ApiBody)({ type: agent_dto_1.CreateAgentDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Agent créé avec succès',
        type: agent_dto_1.AgentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Données invalides',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Un agent avec ce matricule ou email existe déjà',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [agent_dto_1.CreateAgentDto]),
    __metadata("design:returntype", Promise)
], AgentController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer tous les agents',
        description: 'Récupère une liste paginée de tous les agents avec filtres optionnels',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Liste des agents récupérée avec succès',
        schema: all_agent_dto_1.AllAgentSchema
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Non authentifié',
        type: response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.AgentPaginationQueryDto]),
    __metadata("design:returntype", Promise)
], AgentController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer un agent par ID',
        description: 'Récupère les détails d\'un agent spécifique par son ID',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID de l\'agent',
        type: Number,
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Agent récupéré avec succès',
        type: agent_dto_1.AgentWithRelationsDto,
        schema: agent_detail_schema_1.AgentDetailSchema
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Agent non trouvé',
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
], AgentController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/statistics'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer les statistiques d\'un agent',
        description: 'Récupère les statistiques (nombre de déclarations, escouades, ordres de mission) d\'un agent',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID de l\'agent',
        type: Number,
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
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
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Agent non trouvé',
        type: response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AgentController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Mettre à jour un agent',
        description: 'Met à jour les informations d\'un agent existant',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID de l\'agent à mettre à jour',
        type: Number,
        example: 1,
    }),
    (0, swagger_1.ApiBody)({ type: agent_dto_1.UpdateAgentDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Agent mis à jour avec succès',
        type: agent_dto_1.AgentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Données invalides',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Agent non trouvé',
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Un agent avec ce matricule ou email existe déjà',
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
    __metadata("design:paramtypes", [Number, agent_dto_1.UpdateAgentDto]),
    __metadata("design:returntype", Promise)
], AgentController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/activate'),
    (0, swagger_1.ApiOperation)({
        summary: 'Activer un agent',
        description: 'Active un agent désactivé',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID de l\'agent',
        type: Number,
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Agent activé avec succès',
        type: (response_dto_1.SuccessResponseDto),
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Agent non trouvé',
        type: response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AgentController.prototype, "activate", null);
__decorate([
    (0, common_1.Put)(':id/deactivate'),
    (0, swagger_1.ApiOperation)({
        summary: 'Désactiver un agent',
        description: 'Désactive un agent actif',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID de l\'agent',
        type: Number,
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Agent désactivé avec succès',
        type: (response_dto_1.SuccessResponseDto),
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Agent non trouvé',
        type: response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AgentController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Supprimer un agent',
        description: 'Désactive un agent (soft delete via isActive)',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID de l\'agent à supprimer',
        type: Number,
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Agent désactivé avec succès',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Agent non trouvé',
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
], AgentController.prototype, "remove", null);
exports.AgentController = AgentController = __decorate([
    (0, swagger_1.ApiTags)('Agents'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('agents'),
    __metadata("design:paramtypes", [agent_service_1.AgentService])
], AgentController);
//# sourceMappingURL=agent.controller.js.map