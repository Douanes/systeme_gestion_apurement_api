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
exports.AgentPaginationQueryDto = exports.AgentSortField = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
var AgentSortField;
(function (AgentSortField) {
    AgentSortField["ID"] = "id";
    AgentSortField["MATRICULE"] = "matricule";
    AgentSortField["GRADE"] = "grade";
    AgentSortField["FIRSTNAME"] = "firstname";
    AgentSortField["LASTNAME"] = "lastname";
    AgentSortField["EMAIL"] = "email";
    AgentSortField["PHONE"] = "phone";
    AgentSortField["AFFECTED_AT"] = "affectedAt";
    AgentSortField["IS_ACTIVE"] = "isActive";
    AgentSortField["CREATED_AT"] = "createdAt";
    AgentSortField["UPDATED_AT"] = "updatedAt";
})(AgentSortField || (exports.AgentSortField = AgentSortField = {}));
class AgentPaginationQueryDto {
    constructor() {
        this.page = 1;
        this.limit = 10;
        this.sortBy = AgentSortField.CREATED_AT;
        this.sortOrder = 'desc';
    }
}
exports.AgentPaginationQueryDto = AgentPaginationQueryDto;
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
], AgentPaginationQueryDto.prototype, "page", void 0);
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
], AgentPaginationQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Terme de recherche (recherche dans matricule, prénom, nom, email, téléphone)',
        example: 'Dupont',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AgentPaginationQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filtrer par statut actif',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Boolean),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AgentPaginationQueryDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filtrer par bureau d\'affectation',
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], AgentPaginationQueryDto.prototype, "officeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filtrer par grade',
        example: 'Inspecteur',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AgentPaginationQueryDto.prototype, "grade", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Champ de tri',
        example: AgentSortField.CREATED_AT,
        enum: AgentSortField,
        default: AgentSortField.CREATED_AT,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(AgentSortField),
    __metadata("design:type", String)
], AgentPaginationQueryDto.prototype, "sortBy", void 0);
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
], AgentPaginationQueryDto.prototype, "sortOrder", void 0);
//# sourceMappingURL=pagination.dto.js.map