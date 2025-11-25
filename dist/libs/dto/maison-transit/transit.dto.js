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
exports.MaisonTransitWithRelationsDto = exports.MaisonTransitResponseDto = exports.UpdateMaisonTransitDto = exports.CreateMaisonTransitDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateMaisonTransitDto {
}
exports.CreateMaisonTransitDto = CreateMaisonTransitDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Code unique de la maison de transit',
        example: 'MT-001',
        minLength: 2,
        maxLength: 50,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le code de la maison de transit est requis' }),
    (0, class_validator_1.MinLength)(2, { message: 'Le code doit contenir au moins 2 caractères' }),
    (0, class_validator_1.MaxLength)(50, { message: 'Le code ne peut pas dépasser 50 caractères' }),
    __metadata("design:type", String)
], CreateMaisonTransitDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nom de la maison de transit',
        example: 'Maison de Transit Dakar',
        minLength: 2,
        maxLength: 255,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le nom de la maison de transit est requis' }),
    (0, class_validator_1.MinLength)(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
    (0, class_validator_1.MaxLength)(255, { message: 'Le nom ne peut pas dépasser 255 caractères' }),
    __metadata("design:type", String)
], CreateMaisonTransitDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Adresse complète de la maison de transit',
        example: 'Avenue Malick Sy, Dakar, Sénégal',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMaisonTransitDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Numéro de téléphone',
        example: '+221771234567',
        maxLength: 20,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20, { message: 'Le téléphone ne peut pas dépasser 20 caractères' }),
    __metadata("design:type", String)
], CreateMaisonTransitDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Adresse email',
        example: 'contact@maisontransit.sn',
        maxLength: 255,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: 'Email invalide' }),
    (0, class_validator_1.MaxLength)(255, { message: 'L\'email ne peut pas dépasser 255 caractères' }),
    __metadata("design:type", String)
], CreateMaisonTransitDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID du responsable de la maison de transit',
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateMaisonTransitDto.prototype, "responsableId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Statut actif de la maison de transit',
        example: true,
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateMaisonTransitDto.prototype, "isActive", void 0);
class UpdateMaisonTransitDto extends (0, swagger_1.PartialType)(CreateMaisonTransitDto) {
}
exports.UpdateMaisonTransitDto = UpdateMaisonTransitDto;
class MaisonTransitResponseDto {
}
exports.MaisonTransitResponseDto = MaisonTransitResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID unique de la maison de transit',
        example: 1,
    }),
    __metadata("design:type", Number)
], MaisonTransitResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Code unique',
        example: 'MT-001',
    }),
    __metadata("design:type", String)
], MaisonTransitResponseDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nom de la maison de transit',
        example: 'Maison de Transit Dakar',
    }),
    __metadata("design:type", String)
], MaisonTransitResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Adresse',
        example: 'Avenue Malick Sy, Dakar, Sénégal',
        nullable: true,
    }),
    __metadata("design:type", Object)
], MaisonTransitResponseDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Numéro de téléphone',
        example: '+221771234567',
        nullable: true,
    }),
    __metadata("design:type", Object)
], MaisonTransitResponseDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Adresse email',
        example: 'contact@maisontransit.sn',
        nullable: true,
    }),
    __metadata("design:type", Object)
], MaisonTransitResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID du responsable',
        example: 1,
        nullable: true,
    }),
    __metadata("design:type", Object)
], MaisonTransitResponseDto.prototype, "responsableId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Statut actif',
        example: true,
    }),
    __metadata("design:type", Boolean)
], MaisonTransitResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date de création',
        example: '2024-01-15T10:30:00.000Z',
    }),
    __metadata("design:type", Date)
], MaisonTransitResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date de dernière modification',
        example: '2024-01-15T10:30:00.000Z',
    }),
    __metadata("design:type", Date)
], MaisonTransitResponseDto.prototype, "updatedAt", void 0);
class MaisonTransitWithRelationsDto extends MaisonTransitResponseDto {
}
exports.MaisonTransitWithRelationsDto = MaisonTransitWithRelationsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Responsable de la maison de transit',
    }),
    __metadata("design:type", Object)
], MaisonTransitWithRelationsDto.prototype, "responsable", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Liste des dépositaires',
        type: 'array',
        isArray: true,
    }),
    __metadata("design:type", Array)
], MaisonTransitWithRelationsDto.prototype, "depositaires", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Liste des déclarations',
        type: 'array',
        isArray: true,
    }),
    __metadata("design:type", Array)
], MaisonTransitWithRelationsDto.prototype, "declarations", void 0);
//# sourceMappingURL=transit.dto.js.map