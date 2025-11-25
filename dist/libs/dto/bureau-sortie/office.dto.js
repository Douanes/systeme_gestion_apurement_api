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
exports.BureauSortieWithRelationsDto = exports.BureauSortieResponseDto = exports.UpdateBureauSortieDto = exports.CreateBureauSortieDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateBureauSortieDto {
}
exports.CreateBureauSortieDto = CreateBureauSortieDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Code unique du bureau de sortie',
        example: 'BS-001',
        minLength: 2,
        maxLength: 50,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le code du bureau est requis' }),
    (0, class_validator_1.MinLength)(2, { message: 'Le code doit contenir au moins 2 caractères' }),
    (0, class_validator_1.MaxLength)(50, { message: 'Le code ne peut pas dépasser 50 caractères' }),
    __metadata("design:type", String)
], CreateBureauSortieDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nom du bureau de sortie',
        example: 'Bureau de Rosso',
        minLength: 2,
        maxLength: 255,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le nom du bureau est requis' }),
    (0, class_validator_1.MinLength)(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
    (0, class_validator_1.MaxLength)(255, { message: 'Le nom ne peut pas dépasser 255 caractères' }),
    __metadata("design:type", String)
], CreateBureauSortieDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Localisation géographique du bureau',
        example: 'Rosso, Région de Trarza',
        maxLength: 500,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500, { message: 'La localisation ne peut pas dépasser 500 caractères' }),
    __metadata("design:type", String)
], CreateBureauSortieDto.prototype, "localisation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Pays frontalier',
        example: 'Mauritanie',
        maxLength: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100, { message: 'Le pays frontalier ne peut pas dépasser 100 caractères' }),
    __metadata("design:type", String)
], CreateBureauSortieDto.prototype, "paysFrontiere", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Statut actif du bureau',
        example: true,
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateBureauSortieDto.prototype, "isActive", void 0);
class UpdateBureauSortieDto extends (0, swagger_1.PartialType)(CreateBureauSortieDto) {
}
exports.UpdateBureauSortieDto = UpdateBureauSortieDto;
class BureauSortieResponseDto {
}
exports.BureauSortieResponseDto = BureauSortieResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID unique du bureau de sortie',
        example: 1,
    }),
    __metadata("design:type", Number)
], BureauSortieResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Code unique du bureau',
        example: 'BS-001',
    }),
    __metadata("design:type", String)
], BureauSortieResponseDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nom du bureau de sortie',
        example: 'Bureau de Rosso',
    }),
    __metadata("design:type", String)
], BureauSortieResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Localisation géographique',
        example: 'Rosso, Région de Trarza',
        nullable: true,
    }),
    __metadata("design:type", Object)
], BureauSortieResponseDto.prototype, "localisation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Pays frontalier',
        example: 'Mauritanie',
        nullable: true,
    }),
    __metadata("design:type", Object)
], BureauSortieResponseDto.prototype, "paysFrontiere", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Statut actif du bureau',
        example: true,
    }),
    __metadata("design:type", Boolean)
], BureauSortieResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date de création',
        example: '2024-01-15T10:30:00.000Z',
    }),
    __metadata("design:type", Date)
], BureauSortieResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date de dernière modification',
        example: '2024-01-15T10:30:00.000Z',
    }),
    __metadata("design:type", Date)
], BureauSortieResponseDto.prototype, "updatedAt", void 0);
class BureauSortieWithRelationsDto extends BureauSortieResponseDto {
}
exports.BureauSortieWithRelationsDto = BureauSortieWithRelationsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Liste des déclarations associées',
        type: 'array',
        isArray: true,
    }),
    __metadata("design:type", Array)
], BureauSortieWithRelationsDto.prototype, "declarations", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Liste des agents affectés',
        type: 'array',
        isArray: true,
    }),
    __metadata("design:type", Array)
], BureauSortieWithRelationsDto.prototype, "agents", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Liste des ordres de mission',
        type: 'array',
        isArray: true,
    }),
    __metadata("design:type", Array)
], BureauSortieWithRelationsDto.prototype, "ordreMissions", void 0);
//# sourceMappingURL=office.dto.js.map