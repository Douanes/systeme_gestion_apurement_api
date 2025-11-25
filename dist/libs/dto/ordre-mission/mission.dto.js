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
exports.OrdreMissionWithRelationsDto = exports.OrdreMissionResponseDto = exports.UpdateOrdreMissionDto = exports.CreateOrdreMissionDto = exports.CreateNestedVoitureDto = exports.CreateNestedCamionDto = exports.CreateNestedConteneurDto = exports.CreateNestedColisDto = exports.CreateNestedDeclarationDto = exports.StatutApurement = exports.StatutOrdreMission = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var StatutOrdreMission;
(function (StatutOrdreMission) {
    StatutOrdreMission["EN_COURS"] = "EN_COURS";
    StatutOrdreMission["TERMINE"] = "TERMINE";
    StatutOrdreMission["ANNULE"] = "ANNULE";
})(StatutOrdreMission || (exports.StatutOrdreMission = StatutOrdreMission = {}));
var StatutApurement;
(function (StatutApurement) {
    StatutApurement["NON_APURE"] = "NON_APURE";
    StatutApurement["APURE_SE"] = "APURE_SE";
    StatutApurement["REJET"] = "REJET";
})(StatutApurement || (exports.StatutApurement = StatutApurement = {}));
class CreateNestedDeclarationDto {
}
exports.CreateNestedDeclarationDto = CreateNestedDeclarationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Numéro de déclaration unique',
        example: 'DECL-2024-001',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateNestedDeclarationDto.prototype, "numeroDeclaration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date de déclaration',
        example: '2024-01-15',
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateNestedDeclarationDto.prototype, "dateDeclaration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID du dépositaire',
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateNestedDeclarationDto.prototype, "depositaireId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID de la maison de transit',
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateNestedDeclarationDto.prototype, "maisonTransitId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID du bureau de sortie',
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateNestedDeclarationDto.prototype, "bureauSortieId", void 0);
class CreateNestedColisDto {
}
exports.CreateNestedColisDto = CreateNestedColisDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nature de la marchandise',
        example: 'Électronique - Ordinateurs portables',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateNestedColisDto.prototype, "natureMarchandise", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Position tarifaire',
        example: 847130,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateNestedColisDto.prototype, "positionTarifaire", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Poids en kg',
        example: 250.50,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateNestedColisDto.prototype, "poids", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Valeur déclarée en FCFA',
        example: 5000000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateNestedColisDto.prototype, "valeurDeclaree", void 0);
class CreateNestedConteneurDto {
}
exports.CreateNestedConteneurDto = CreateNestedConteneurDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Numéro du conteneur',
        example: 'MSCU1234567',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateNestedConteneurDto.prototype, "numConteneur", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Nom du conducteur',
        example: 'Amadou Fall',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNestedConteneurDto.prototype, "driverName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Nationalité du conducteur',
        example: 'Sénégalaise',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNestedConteneurDto.prototype, "driverNationality", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Téléphone',
        example: '+221771234567',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNestedConteneurDto.prototype, "phone", void 0);
class CreateNestedCamionDto {
}
exports.CreateNestedCamionDto = CreateNestedCamionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Immatriculation du camion',
        example: 'DK-1234-AB',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateNestedCamionDto.prototype, "immatriculation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Nom du conducteur',
        example: 'Moussa Diop',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNestedCamionDto.prototype, "driverName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Nationalité du conducteur',
        example: 'Sénégalaise',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNestedCamionDto.prototype, "driverNationality", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Téléphone',
        example: '+221772345678',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNestedCamionDto.prototype, "phone", void 0);
class CreateNestedVoitureDto {
}
exports.CreateNestedVoitureDto = CreateNestedVoitureDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Numéro de châssis',
        example: 'VF1KZ0G0H12345678',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateNestedVoitureDto.prototype, "chassis", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Nom du conducteur',
        example: 'Fatou Sow',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNestedVoitureDto.prototype, "driverName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Nationalité du conducteur',
        example: 'Sénégalaise',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNestedVoitureDto.prototype, "driverNationality", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Téléphone',
        example: '+221773456789',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNestedVoitureDto.prototype, "phone", void 0);
class CreateOrdreMissionDto {
}
exports.CreateOrdreMissionDto = CreateOrdreMissionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Numéro d\'ordre (unique)',
        example: 2024001,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le numéro d\'ordre est requis' }),
    __metadata("design:type", Number)
], CreateOrdreMissionDto.prototype, "number", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Destination',
        example: 'Port de Dakar',
        maxLength: 255,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrdreMissionDto.prototype, "destination", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Itinéraire détaillé',
        example: 'Dakar -> Thiès -> Saint-Louis',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrdreMissionDto.prototype, "itin\u00E9raire", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date de l\'ordre',
        example: '2024-01-15',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateOrdreMissionDto.prototype, "dateOrdre", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID du dépositaire',
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateOrdreMissionDto.prototype, "depositaireId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID de la maison de transit',
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateOrdreMissionDto.prototype, "maisonTransitId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Statut de l\'ordre de mission',
        example: StatutOrdreMission.EN_COURS,
        enum: StatutOrdreMission,
        default: StatutOrdreMission.EN_COURS,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(StatutOrdreMission),
    __metadata("design:type", String)
], CreateOrdreMissionDto.prototype, "statut", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Statut d\'apurement',
        example: StatutApurement.NON_APURE,
        enum: StatutApurement,
        default: StatutApurement.NON_APURE,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(StatutApurement),
    __metadata("design:type", String)
], CreateOrdreMissionDto.prototype, "statutApurement", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID de l\'agent escorteur',
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateOrdreMissionDto.prototype, "agentEscorteurId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID du bureau de sortie',
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateOrdreMissionDto.prototype, "bureauSortieId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Observations',
        example: 'Mission prioritaire - Contrôle renforcé requis',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrdreMissionDto.prototype, "observations", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Liste des déclarations à créer',
        type: [CreateNestedDeclarationDto],
        example: [
            {
                numeroDeclaration: 'DECL-2024-001',
                dateDeclaration: '2024-01-15',
                depositaireId: 1,
            },
            {
                numeroDeclaration: 'DECL-2024-002',
                dateDeclaration: '2024-01-15',
                depositaireId: 1,
            },
        ],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateNestedDeclarationDto),
    __metadata("design:type", Array)
], CreateOrdreMissionDto.prototype, "declarations", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Liste des colis à créer',
        type: [CreateNestedColisDto],
        example: [
            {
                natureMarchandise: 'Électronique - Ordinateurs',
                positionTarifaire: 847130,
                poids: 250.5,
                valeurDeclaree: 5000000,
            },
            {
                natureMarchandise: 'Textile - Vêtements',
                poids: 100.0,
                valeurDeclaree: 1500000,
            },
        ],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateNestedColisDto),
    __metadata("design:type", Array)
], CreateOrdreMissionDto.prototype, "colis", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Liste des conteneurs à créer',
        type: [CreateNestedConteneurDto],
        example: [
            {
                numConteneur: 'MSCU1234567',
                driverName: 'Amadou Fall',
                driverNationality: 'Sénégalaise',
                phone: '+221771234567',
            },
        ],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateNestedConteneurDto),
    __metadata("design:type", Array)
], CreateOrdreMissionDto.prototype, "conteneurs", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Liste des camions à créer',
        type: [CreateNestedCamionDto],
        example: [
            {
                immatriculation: 'DK-1234-AB',
                driverName: 'Moussa Diop',
                driverNationality: 'Sénégalaise',
                phone: '+221772345678',
            },
        ],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateNestedCamionDto),
    __metadata("design:type", Array)
], CreateOrdreMissionDto.prototype, "camions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Liste des voitures à créer',
        type: [CreateNestedVoitureDto],
        example: [
            {
                chassis: 'VF1KZ0G0H12345678',
                driverName: 'Fatou Sow',
                driverNationality: 'Sénégalaise',
                phone: '+221773456789',
            },
        ],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateNestedVoitureDto),
    __metadata("design:type", Array)
], CreateOrdreMissionDto.prototype, "voitures", void 0);
class UpdateOrdreMissionDto extends (0, swagger_1.PartialType)(CreateOrdreMissionDto) {
}
exports.UpdateOrdreMissionDto = UpdateOrdreMissionDto;
class OrdreMissionResponseDto {
}
exports.OrdreMissionResponseDto = OrdreMissionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID unique de l\'ordre de mission',
        example: 1,
    }),
    __metadata("design:type", Number)
], OrdreMissionResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Numéro d\'ordre unique',
        example: 2024001,
    }),
    __metadata("design:type", Number)
], OrdreMissionResponseDto.prototype, "number", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Destination',
        example: 'Port de Dakar',
        nullable: true,
    }),
    __metadata("design:type", Object)
], OrdreMissionResponseDto.prototype, "destination", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Itinéraire',
        example: 'Dakar -> Thiès',
        nullable: true,
    }),
    __metadata("design:type", Object)
], OrdreMissionResponseDto.prototype, "itin\u00E9raire", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date de l\'ordre',
        example: '2024-01-15T00:00:00.000Z',
        nullable: true,
    }),
    __metadata("design:type", Object)
], OrdreMissionResponseDto.prototype, "dateOrdre", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID du dépositaire',
        example: 1,
        nullable: true,
    }),
    __metadata("design:type", Object)
], OrdreMissionResponseDto.prototype, "depositaireId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID de la maison de transit',
        example: 1,
        nullable: true,
    }),
    __metadata("design:type", Object)
], OrdreMissionResponseDto.prototype, "maisonTransitId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID de l\'utilisateur créateur',
        example: 1,
        nullable: true,
    }),
    __metadata("design:type", Object)
], OrdreMissionResponseDto.prototype, "createdById", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Statut de l\'ordre',
        example: StatutOrdreMission.EN_COURS,
        enum: StatutOrdreMission,
    }),
    __metadata("design:type", String)
], OrdreMissionResponseDto.prototype, "statut", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Statut d\'apurement',
        example: StatutApurement.NON_APURE,
        enum: StatutApurement,
    }),
    __metadata("design:type", String)
], OrdreMissionResponseDto.prototype, "statutApurement", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID de l\'agent escorteur',
        example: 1,
        nullable: true,
    }),
    __metadata("design:type", Object)
], OrdreMissionResponseDto.prototype, "agentEscorteurId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID du bureau de sortie',
        example: 1,
        nullable: true,
    }),
    __metadata("design:type", Object)
], OrdreMissionResponseDto.prototype, "bureauSortieId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Observations',
        example: 'Mission prioritaire',
        nullable: true,
    }),
    __metadata("design:type", Object)
], OrdreMissionResponseDto.prototype, "observations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date de création',
        example: '2024-01-15T10:30:00.000Z',
    }),
    __metadata("design:type", Date)
], OrdreMissionResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date de dernière modification',
        example: '2024-01-15T10:30:00.000Z',
    }),
    __metadata("design:type", Date)
], OrdreMissionResponseDto.prototype, "updatedAt", void 0);
class OrdreMissionWithRelationsDto extends OrdreMissionResponseDto {
}
exports.OrdreMissionWithRelationsDto = OrdreMissionWithRelationsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Dépositaire',
        nullable: true,
        example: {
            id: 1,
            name: 'Dépositaire Dakar',
            phone1: '+221771111111',
        },
    }),
    __metadata("design:type", Object)
], OrdreMissionWithRelationsDto.prototype, "depositaire", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maison de transit',
        nullable: true,
        example: {
            id: 1,
            name: 'Maison Transit Dakar',
            code: 'MTD-001',
        },
    }),
    __metadata("design:type", Object)
], OrdreMissionWithRelationsDto.prototype, "maisonTransit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Utilisateur créateur',
        nullable: true,
        example: {
            id: 1,
            username: 'admin',
            email: 'admin@douanes.sn',
        },
    }),
    __metadata("design:type", Object)
], OrdreMissionWithRelationsDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Agent escorteur',
        nullable: true,
        example: {
            id: 1,
            matricule: 'AG-001',
            firstname: 'Jean',
            lastname: 'Dupont',
        },
    }),
    __metadata("design:type", Object)
], OrdreMissionWithRelationsDto.prototype, "agentEscorteur", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Bureau de sortie',
        nullable: true,
        example: {
            id: 1,
            name: 'Bureau Dakar',
            code: 'BDS-001',
        },
    }),
    __metadata("design:type", Object)
], OrdreMissionWithRelationsDto.prototype, "bureauSortie", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Déclarations',
        type: 'array',
        isArray: true,
        example: [
            {
                id: 1,
                numeroDeclaration: 'DECL-2024-001',
                dateDeclaration: '2024-01-15',
                statutApurement: 'NON_APURE',
            },
        ],
    }),
    __metadata("design:type", Array)
], OrdreMissionWithRelationsDto.prototype, "declarations", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Colis',
        type: 'array',
        isArray: true,
        example: [
            {
                id: 1,
                natureMarchandise: 'Électronique',
                poids: 250.5,
                valeurDeclaree: 5000000,
            },
        ],
    }),
    __metadata("design:type", Array)
], OrdreMissionWithRelationsDto.prototype, "colis", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Conteneurs',
        type: 'array',
        isArray: true,
        example: [
            {
                id: 1,
                numConteneur: 'MSCU1234567',
                driverName: 'Amadou Fall',
            },
        ],
    }),
    __metadata("design:type", Array)
], OrdreMissionWithRelationsDto.prototype, "conteneurs", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Camions',
        type: 'array',
        isArray: true,
        example: [
            {
                id: 1,
                immatriculation: 'DK-1234-AB',
                driverName: 'Moussa Diop',
            },
        ],
    }),
    __metadata("design:type", Array)
], OrdreMissionWithRelationsDto.prototype, "camions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Voitures',
        type: 'array',
        isArray: true,
        example: [
            {
                id: 1,
                chassis: 'VF1KZ0G0H12345678',
                driverName: 'Fatou Sow',
            },
        ],
    }),
    __metadata("design:type", Array)
], OrdreMissionWithRelationsDto.prototype, "voitures", void 0);
//# sourceMappingURL=mission.dto.js.map