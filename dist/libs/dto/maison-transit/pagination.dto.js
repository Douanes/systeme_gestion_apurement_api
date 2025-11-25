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
exports.MaisonTransitPaginationQueryDto = exports.MaisonTransitSortField = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
var MaisonTransitSortField;
(function (MaisonTransitSortField) {
    MaisonTransitSortField["ID"] = "id";
    MaisonTransitSortField["CODE"] = "code";
    MaisonTransitSortField["NAME"] = "name";
    MaisonTransitSortField["ADDRESS"] = "address";
    MaisonTransitSortField["PHONE"] = "phone";
    MaisonTransitSortField["EMAIL"] = "email";
    MaisonTransitSortField["IS_ACTIVE"] = "isActive";
    MaisonTransitSortField["CREATED_AT"] = "createdAt";
    MaisonTransitSortField["UPDATED_AT"] = "updatedAt";
})(MaisonTransitSortField || (exports.MaisonTransitSortField = MaisonTransitSortField = {}));
class MaisonTransitPaginationQueryDto {
    constructor() {
        this.page = 1;
        this.limit = 10;
        this.sortBy = MaisonTransitSortField.CREATED_AT;
        this.sortOrder = 'desc';
    }
}
exports.MaisonTransitPaginationQueryDto = MaisonTransitPaginationQueryDto;
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
], MaisonTransitPaginationQueryDto.prototype, "page", void 0);
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
], MaisonTransitPaginationQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Terme de recherche (recherche dans le code, nom, adresse, téléphone et email)',
        example: 'Dakar',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MaisonTransitPaginationQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filtrer par statut actif',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Boolean),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], MaisonTransitPaginationQueryDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Champ de tri',
        example: MaisonTransitSortField.CREATED_AT,
        enum: MaisonTransitSortField,
        default: MaisonTransitSortField.CREATED_AT,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(MaisonTransitSortField),
    __metadata("design:type", String)
], MaisonTransitPaginationQueryDto.prototype, "sortBy", void 0);
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
], MaisonTransitPaginationQueryDto.prototype, "sortOrder", void 0);
//# sourceMappingURL=pagination.dto.js.map