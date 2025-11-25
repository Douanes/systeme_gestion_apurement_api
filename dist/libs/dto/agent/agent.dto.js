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
exports.AgentWithRelationsDto = exports.AgentResponseDto = exports.UpdateAgentDto = exports.CreateAgentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateAgentDto {
}
exports.CreateAgentDto = CreateAgentDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Matricule unique de l\'agent',
        example: 'AG-2024-001',
        maxLength: 50,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50, { message: 'Le matricule ne peut pas dépasser 50 caractères' }),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "matricule", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Grade de l\'agent',
        example: 'Inspecteur Principal',
        maxLength: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100, { message: 'Le grade ne peut pas dépasser 100 caractères' }),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "grade", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Prénom de l\'agent',
        example: 'Jean',
        minLength: 2,
        maxLength: 100,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le prénom est requis' }),
    (0, class_validator_1.MinLength)(2, { message: 'Le prénom doit contenir au moins 2 caractères' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Le prénom ne peut pas dépasser 100 caractères' }),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "firstname", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nom de famille de l\'agent',
        example: 'Dupont',
        minLength: 2,
        maxLength: 100,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le nom de famille est requis' }),
    (0, class_validator_1.MinLength)(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Le nom ne peut pas dépasser 100 caractères' }),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "lastname", void 0);
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
], CreateAgentDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Adresse email',
        example: 'jean.dupont@douanes.sn',
        maxLength: 255,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: 'Email invalide' }),
    (0, class_validator_1.MaxLength)(255, { message: 'L\'email ne peut pas dépasser 255 caractères' }),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date d\'affectation',
        example: '2024-01-15',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "affectedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID du bureau d\'affectation',
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateAgentDto.prototype, "officeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Statut actif de l\'agent',
        example: true,
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAgentDto.prototype, "isActive", void 0);
class UpdateAgentDto extends (0, swagger_1.PartialType)(CreateAgentDto) {
}
exports.UpdateAgentDto = UpdateAgentDto;
class AgentResponseDto {
}
exports.AgentResponseDto = AgentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID unique de l\'agent',
        example: 1,
    }),
    __metadata("design:type", Number)
], AgentResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Matricule unique',
        example: 'AG-2024-001',
        nullable: true,
    }),
    __metadata("design:type", Object)
], AgentResponseDto.prototype, "matricule", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Grade',
        example: 'Inspecteur Principal',
        nullable: true,
    }),
    __metadata("design:type", Object)
], AgentResponseDto.prototype, "grade", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Prénom',
        example: 'Jean',
    }),
    __metadata("design:type", String)
], AgentResponseDto.prototype, "firstname", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nom de famille',
        example: 'Dupont',
    }),
    __metadata("design:type", String)
], AgentResponseDto.prototype, "lastname", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Numéro de téléphone',
        example: '+221771234567',
        nullable: true,
    }),
    __metadata("design:type", Object)
], AgentResponseDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Adresse email',
        example: 'jean.dupont@douanes.sn',
        nullable: true,
    }),
    __metadata("design:type", Object)
], AgentResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date d\'affectation',
        example: '2024-01-15T00:00:00.000Z',
        nullable: true,
    }),
    __metadata("design:type", Object)
], AgentResponseDto.prototype, "affectedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID du bureau d\'affectation',
        example: 1,
        nullable: true,
    }),
    __metadata("design:type", Object)
], AgentResponseDto.prototype, "officeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Statut actif',
        example: true,
    }),
    __metadata("design:type", Boolean)
], AgentResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date de création',
        example: '2024-01-15T10:30:00.000Z',
    }),
    __metadata("design:type", Date)
], AgentResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date de dernière modification',
        example: '2024-01-15T10:30:00.000Z',
    }),
    __metadata("design:type", Date)
], AgentResponseDto.prototype, "updatedAt", void 0);
class AgentWithRelationsDto extends AgentResponseDto {
}
exports.AgentWithRelationsDto = AgentWithRelationsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Bureau d\'affectation',
        nullable: true,
        example: {
            id: 1,
            name: 'Bureau des Douanes de Dakar',
            code: 'BDD-001',
            address: 'Avenue Malick Sy, Dakar',
            phone: '+221771111111',
        },
    }),
    __metadata("design:type", Object)
], AgentWithRelationsDto.prototype, "bureauAffectation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Déclarations associées',
        type: 'array',
        isArray: true,
        example: [
            {
                id: 1,
                numeroDeclaration: 'DECL-2024-001',
                dateDeclaration: '2024-01-15T00:00:00.000Z',
                typeDeclaration: 'Import',
                statut: 'Validée',
            },
            {
                id: 2,
                numeroDeclaration: 'DECL-2024-002',
                dateDeclaration: '2024-01-16T00:00:00.000Z',
                typeDeclaration: 'Export',
                statut: 'En cours',
            },
        ],
    }),
    __metadata("design:type", Array)
], AgentWithRelationsDto.prototype, "declarations", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Escouades dont l\'agent est chef',
        type: 'array',
        isArray: true,
        example: [
            {
                id: 1,
                name: 'Escouade Alpha',
                description: 'Escouade spécialisée dans les contrôles frontaliers',
                operationalDate: '2024-01-15T00:00:00.000Z',
            },
            {
                id: 2,
                name: 'Escouade Beta',
                description: 'Escouade de surveillance portuaire',
                operationalDate: '2024-02-01T00:00:00.000Z',
            },
        ],
    }),
    __metadata("design:type", Array)
], AgentWithRelationsDto.prototype, "escouadesAsChef", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Escouades dont l\'agent est adjoint',
        type: 'array',
        isArray: true,
        example: [
            {
                id: 3,
                name: 'Escouade Gamma',
                description: 'Escouade de contrôle aérien',
                operationalDate: '2024-01-20T00:00:00.000Z',
            },
        ],
    }),
    __metadata("design:type", Array)
], AgentWithRelationsDto.prototype, "escouadesAsAdjoint", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Escouades dont l\'agent est membre',
        type: 'array',
        isArray: true,
        example: [
            {
                escouadeId: 4,
                agentId: 1,
                escouade: {
                    id: 4,
                    name: 'Escouade Delta',
                    description: 'Escouade d\'intervention rapide',
                    operationalDate: '2024-03-01T00:00:00.000Z',
                },
            },
            {
                escouadeId: 5,
                agentId: 1,
                escouade: {
                    id: 5,
                    name: 'Escouade Epsilon',
                    description: 'Escouade de patrouille',
                    operationalDate: '2024-03-15T00:00:00.000Z',
                },
            },
        ],
    }),
    __metadata("design:type", Array)
], AgentWithRelationsDto.prototype, "escouadeAgents", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Ordres de mission assignés',
        type: 'array',
        isArray: true,
        example: [
            {
                id: 1,
                numeroOrdre: 'OM-2024-001',
                dateDebut: '2024-01-15T00:00:00.000Z',
                dateFin: '2024-01-20T00:00:00.000Z',
                lieu: 'Port de Dakar',
                objectif: 'Contrôle des marchandises',
                statut: 'En cours',
            },
            {
                id: 2,
                numeroOrdre: 'OM-2024-002',
                dateDebut: '2024-01-25T00:00:00.000Z',
                dateFin: '2024-01-30T00:00:00.000Z',
                lieu: 'Aéroport Blaise Diagne',
                objectif: 'Surveillance douanière',
                statut: 'Planifié',
            },
        ],
    }),
    __metadata("design:type", Array)
], AgentWithRelationsDto.prototype, "ordreMissions", void 0);
//# sourceMappingURL=agent.dto.js.map