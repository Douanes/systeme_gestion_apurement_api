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
exports.RegimeResponseDto = exports.UpdateRegimeDto = exports.CreateRegimeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateRegimeDto {
}
exports.CreateRegimeDto = CreateRegimeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nom du régime douanier',
        example: 'Transit ordinaire',
        minLength: 2,
        maxLength: 255,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le nom du régime est requis' }),
    (0, class_validator_1.MinLength)(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
    (0, class_validator_1.MaxLength)(255, { message: 'Le nom ne peut pas dépasser 255 caractères' }),
    __metadata("design:type", String)
], CreateRegimeDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Description détaillée du régime',
        example: 'Régime permettant le transit de marchandises sous douane',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRegimeDto.prototype, "description", void 0);
class UpdateRegimeDto extends (0, swagger_1.PartialType)(CreateRegimeDto) {
}
exports.UpdateRegimeDto = UpdateRegimeDto;
class RegimeResponseDto {
}
exports.RegimeResponseDto = RegimeResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID unique du régime',
        example: 1,
    }),
    __metadata("design:type", Number)
], RegimeResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nom du régime douanier',
        example: 'Transit ordinaire',
    }),
    __metadata("design:type", String)
], RegimeResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Description du régime',
        example: 'Régime permettant le transit de marchandises sous douane',
    }),
    __metadata("design:type", Object)
], RegimeResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date de création',
        example: '2024-01-15T10:30:00.000Z',
    }),
    __metadata("design:type", Date)
], RegimeResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date de dernière modification',
        example: '2024-01-15T10:30:00.000Z',
    }),
    __metadata("design:type", Date)
], RegimeResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=regime.dto.js.map