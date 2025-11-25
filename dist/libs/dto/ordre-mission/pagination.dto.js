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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdreMissionPaginationQueryDto = exports.OrdreMissionSortField = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
var OrdreMissionSortField;
(function (OrdreMissionSortField) {
    OrdreMissionSortField["ID"] = "id";
    OrdreMissionSortField["NUMERO_ORDRE"] = "numeroOrdre";
    OrdreMissionSortField["DATE_DEBUT"] = "dateDebut";
    OrdreMissionSortField["DATE_FIN"] = "dateFin";
    OrdreMissionSortField["LIEU"] = "lieu";
    OrdreMissionSortField["STATUT"] = "statut";
    OrdreMissionSortField["CREATED_AT"] = "createdAt";
    OrdreMissionSortField["UPDATED_AT"] = "updatedAt";
})(OrdreMissionSortField || (exports.OrdreMissionSortField = OrdreMissionSortField = {}));
class OrdreMissionPaginationQueryDto {
    constructor() {
        this.page = 1;
        this.limit = 10;
        this.sortBy = OrdreMissionSortField.CREATED_AT;
        this.sortOrder = 'desc';
    }
}
exports.OrdreMissionPaginationQueryDto = OrdreMissionPaginationQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Numéro de la page (commence à 1)',
        example: 1,
        minimum: 1,
        default: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], OrdreMissionPaginationQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Nombre d\'éléments par page',
        example: 10,
        minimum: 1,
        maximum: 100,
        default: 10,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], OrdreMissionPaginationQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Terme de recherche (recherche dans numéro, lieu, objectif)',
        example: 'Port',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrdreMissionPaginationQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filtrer par statut',
        example: 'Planifié',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrdreMissionPaginationQueryDto.prototype, "statut", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filtrer par agent',
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], OrdreMissionPaginationQueryDto.prototype, "agentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filtrer par escouade',
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], OrdreMissionPaginationQueryDto.prototype, "escouadeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date de début minimum',
        example: '2024-01-01',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], OrdreMissionPaginationQueryDto.prototype, "dateDebutMin", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date de début maximum',
        example: '2024-12-31',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], OrdreMissionPaginationQueryDto.prototype, "dateDebutMax", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Champ de tri',
        example: OrdreMissionSortField.CREATED_AT,
        enum: OrdreMissionSortField,
        default: OrdreMissionSortField.CREATED_AT,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(OrdreMissionSortField),
    __metadata("design:type", String)
], OrdreMissionPaginationQueryDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Ordre de tri',
        example: 'desc',
        enum: ['asc', 'desc'],
        default: 'desc',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['asc', 'desc']),
    __metadata("design:type", String)
], OrdreMissionPaginationQueryDto.prototype, "sortOrder", void 0);
//# sourceMappingURL=pagination.dto.js.map