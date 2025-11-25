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
exports.BureauSortiePaginationQueryDto = exports.BureauSortieSortField = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
var BureauSortieSortField;
(function (BureauSortieSortField) {
    BureauSortieSortField["ID"] = "id";
    BureauSortieSortField["CODE"] = "code";
    BureauSortieSortField["NAME"] = "name";
    BureauSortieSortField["LOCALISATION"] = "localisation";
    BureauSortieSortField["PAYS_FRONTIERE"] = "paysFrontiere";
    BureauSortieSortField["IS_ACTIVE"] = "isActive";
    BureauSortieSortField["CREATED_AT"] = "createdAt";
    BureauSortieSortField["UPDATED_AT"] = "updatedAt";
})(BureauSortieSortField || (exports.BureauSortieSortField = BureauSortieSortField = {}));
class BureauSortiePaginationQueryDto {
    constructor() {
        this.page = 1;
        this.limit = 10;
        this.sortBy = BureauSortieSortField.CREATED_AT;
        this.sortOrder = 'desc';
    }
}
exports.BureauSortiePaginationQueryDto = BureauSortiePaginationQueryDto;
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
], BureauSortiePaginationQueryDto.prototype, "page", void 0);
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
], BureauSortiePaginationQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Terme de recherche (recherche dans le code, nom, localisation et pays frontalier)',
        example: 'Rosso',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BureauSortiePaginationQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filtrer par statut actif',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Boolean),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BureauSortiePaginationQueryDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filtrer par pays frontalier',
        example: 'Mauritanie',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BureauSortiePaginationQueryDto.prototype, "paysFrontiere", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Champ de tri',
        example: BureauSortieSortField.CREATED_AT,
        enum: BureauSortieSortField,
        default: BureauSortieSortField.CREATED_AT,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(BureauSortieSortField),
    __metadata("design:type", String)
], BureauSortiePaginationQueryDto.prototype, "sortBy", void 0);
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
], BureauSortiePaginationQueryDto.prototype, "sortOrder", void 0);
//# sourceMappingURL=pagination.dto.js.map