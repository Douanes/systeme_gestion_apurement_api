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
exports.RemoveAgentFromEscouadeDto = exports.AddAgentToEscouadeDto = exports.EscouadeWithRelationsDto = exports.EscouadeResponseDto = exports.UpdateEscouadeDto = exports.CreateEscouadeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateEscouadeDto {
}
exports.CreateEscouadeDto = CreateEscouadeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nom unique de l\'escouade',
        example: 'Escouade Alpha',
        minLength: 2,
        maxLength: 255,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le nom de l\'escouade est requis' }),
    (0, class_validator_1.MinLength)(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
    (0, class_validator_1.MaxLength)(255, { message: 'Le nom ne peut pas dépasser 255 caractères' }),
    __metadata("design:type", String)
], CreateEscouadeDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Description de l\'escouade',
        example: 'Escouade spécialisée dans les contrôles frontaliers',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEscouadeDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date de mise en service opérationnel',
        example: '2024-01-15',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateEscouadeDto.prototype, "operationalDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID du chef d\'escouade',
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateEscouadeDto.prototype, "chefId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID de l\'adjoint du chef d\'escouade',
        example: 2,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateEscouadeDto.prototype, "adjointId", void 0);
class UpdateEscouadeDto extends (0, swagger_1.PartialType)(CreateEscouadeDto) {
}
exports.UpdateEscouadeDto = UpdateEscouadeDto;
class EscouadeResponseDto {
}
exports.EscouadeResponseDto = EscouadeResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID unique de l\'escouade',
        example: 1,
    }),
    __metadata("design:type", Number)
], EscouadeResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nom de l\'escouade',
        example: 'Escouade Alpha',
    }),
    __metadata("design:type", String)
], EscouadeResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Description',
        example: 'Escouade spécialisée dans les contrôles frontaliers',
        nullable: true,
    }),
    __metadata("design:type", Object)
], EscouadeResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date de mise en service opérationnel',
        example: '2024-01-15T00:00:00.000Z',
        nullable: true,
    }),
    __metadata("design:type", Object)
], EscouadeResponseDto.prototype, "operationalDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID du chef d\'escouade',
        example: 1,
        nullable: true,
    }),
    __metadata("design:type", Object)
], EscouadeResponseDto.prototype, "chefId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID de l\'adjoint',
        example: 2,
        nullable: true,
    }),
    __metadata("design:type", Object)
], EscouadeResponseDto.prototype, "adjointId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date de création',
        example: '2024-01-15T10:30:00.000Z',
    }),
    __metadata("design:type", Date)
], EscouadeResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date de dernière modification',
        example: '2024-01-15T10:30:00.000Z',
    }),
    __metadata("design:type", Date)
], EscouadeResponseDto.prototype, "updatedAt", void 0);
class EscouadeWithRelationsDto extends EscouadeResponseDto {
}
exports.EscouadeWithRelationsDto = EscouadeWithRelationsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Chef de l\'escouade',
    }),
    __metadata("design:type", Object)
], EscouadeWithRelationsDto.prototype, "chef", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Adjoint du chef',
    }),
    __metadata("design:type", Object)
], EscouadeWithRelationsDto.prototype, "adjoint", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Liste des agents membres de l\'escouade',
        type: 'array',
        isArray: true,
    }),
    __metadata("design:type", Array)
], EscouadeWithRelationsDto.prototype, "escouadeAgents", void 0);
class AddAgentToEscouadeDto {
}
exports.AddAgentToEscouadeDto = AddAgentToEscouadeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID de l\'agent à ajouter',
        example: 1,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'L\'ID de l\'agent est requis' }),
    __metadata("design:type", Number)
], AddAgentToEscouadeDto.prototype, "agentId", void 0);
class RemoveAgentFromEscouadeDto {
}
exports.RemoveAgentFromEscouadeDto = RemoveAgentFromEscouadeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID de l\'agent à retirer',
        example: 1,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'L\'ID de l\'agent est requis' }),
    __metadata("design:type", Number)
], RemoveAgentFromEscouadeDto.prototype, "agentId", void 0);
//# sourceMappingURL=escouade.dto.js.map