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
exports.DestinationRouteDto = exports.DestinationTrendDto = exports.DestinationByBureauDto = exports.DestinationStatisticsResponseDto = exports.DestinationStatisticsItemDto = exports.DestinationStatisticsQueryDto = exports.MarchandiseTrendDto = exports.MarchandiseByBureauDto = exports.MarchandiseStatisticsResponseDto = exports.MarchandiseStatisticsItemDto = exports.MarchandiseStatisticsQueryDto = exports.ApurementTrendResponseDto = exports.ApurementByBureauResponseDto = exports.ApurementStatisticsResponseDto = exports.ApurementStatisticsQueryDto = exports.PeriodFilter = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var PeriodFilter;
(function (PeriodFilter) {
    PeriodFilter["TODAY"] = "TODAY";
    PeriodFilter["THIS_WEEK"] = "THIS_WEEK";
    PeriodFilter["THIS_MONTH"] = "THIS_MONTH";
    PeriodFilter["THIS_YEAR"] = "THIS_YEAR";
    PeriodFilter["LAST_7_DAYS"] = "LAST_7_DAYS";
    PeriodFilter["LAST_30_DAYS"] = "LAST_30_DAYS";
    PeriodFilter["LAST_90_DAYS"] = "LAST_90_DAYS";
    PeriodFilter["CUSTOM"] = "CUSTOM";
})(PeriodFilter || (exports.PeriodFilter = PeriodFilter = {}));
class ApurementStatisticsQueryDto {
}
exports.ApurementStatisticsQueryDto = ApurementStatisticsQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID du bureau de sortie',
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], ApurementStatisticsQueryDto.prototype, "bureauSortieId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date de début (format ISO)',
        example: '2024-01-01',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ApurementStatisticsQueryDto.prototype, "dateDebut", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date de fin (format ISO)',
        example: '2024-12-31',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ApurementStatisticsQueryDto.prototype, "dateFin", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Période prédéfinie',
        enum: PeriodFilter,
        example: PeriodFilter.THIS_MONTH,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(PeriodFilter),
    __metadata("design:type", String)
], ApurementStatisticsQueryDto.prototype, "period", void 0);
class ApurementStatisticsResponseDto {
}
exports.ApurementStatisticsResponseDto = ApurementStatisticsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total des ordres de mission',
        example: 150,
    }),
    __metadata("design:type", Number)
], ApurementStatisticsResponseDto.prototype, "totalOrdres", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre d\'ordres apurés',
        example: 120,
    }),
    __metadata("design:type", Number)
], ApurementStatisticsResponseDto.prototype, "apures", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre d\'ordres non apurés',
        example: 25,
    }),
    __metadata("design:type", Number)
], ApurementStatisticsResponseDto.prototype, "nonApures", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre d\'ordres rejetés',
        example: 5,
    }),
    __metadata("design:type", Number)
], ApurementStatisticsResponseDto.prototype, "rejetes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Taux d\'apurement (%)',
        example: 80.0,
    }),
    __metadata("design:type", Number)
], ApurementStatisticsResponseDto.prototype, "tauxApurement", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Période de la statistique',
        example: {
            debut: '2024-01-01T00:00:00.000Z',
            fin: '2024-12-31T23:59:59.999Z',
        },
    }),
    __metadata("design:type", Object)
], ApurementStatisticsResponseDto.prototype, "periode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Bureau de sortie filtré (si applicable)',
        example: {
            id: 1,
            name: 'Bureau Dakar',
            code: 'BDS-001',
        },
        nullable: true,
    }),
    __metadata("design:type", Object)
], ApurementStatisticsResponseDto.prototype, "bureauSortie", void 0);
class ApurementByBureauResponseDto {
}
exports.ApurementByBureauResponseDto = ApurementByBureauResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID du bureau de sortie',
        example: 1,
    }),
    __metadata("design:type", Number)
], ApurementByBureauResponseDto.prototype, "bureauSortieId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nom du bureau',
        example: 'Bureau Dakar',
    }),
    __metadata("design:type", String)
], ApurementByBureauResponseDto.prototype, "bureauName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Code du bureau',
        example: 'BDS-001',
    }),
    __metadata("design:type", String)
], ApurementByBureauResponseDto.prototype, "bureauCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total des ordres',
        example: 50,
    }),
    __metadata("design:type", Number)
], ApurementByBureauResponseDto.prototype, "totalOrdres", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ordres apurés',
        example: 40,
    }),
    __metadata("design:type", Number)
], ApurementByBureauResponseDto.prototype, "apures", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ordres non apurés',
        example: 8,
    }),
    __metadata("design:type", Number)
], ApurementByBureauResponseDto.prototype, "nonApures", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ordres rejetés',
        example: 2,
    }),
    __metadata("design:type", Number)
], ApurementByBureauResponseDto.prototype, "rejetes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Taux d\'apurement (%)',
        example: 80.0,
    }),
    __metadata("design:type", Number)
], ApurementByBureauResponseDto.prototype, "tauxApurement", void 0);
class ApurementTrendResponseDto {
}
exports.ApurementTrendResponseDto = ApurementTrendResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date ou période',
        example: '2024-01',
    }),
    __metadata("design:type", String)
], ApurementTrendResponseDto.prototype, "period", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total des ordres',
        example: 50,
    }),
    __metadata("design:type", Number)
], ApurementTrendResponseDto.prototype, "totalOrdres", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ordres apurés',
        example: 40,
    }),
    __metadata("design:type", Number)
], ApurementTrendResponseDto.prototype, "apures", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ordres non apurés',
        example: 8,
    }),
    __metadata("design:type", Number)
], ApurementTrendResponseDto.prototype, "nonApures", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ordres rejetés',
        example: 2,
    }),
    __metadata("design:type", Number)
], ApurementTrendResponseDto.prototype, "rejetes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Taux d\'apurement (%)',
        example: 80.0,
    }),
    __metadata("design:type", Number)
], ApurementTrendResponseDto.prototype, "tauxApurement", void 0);
class MarchandiseStatisticsQueryDto {
}
exports.MarchandiseStatisticsQueryDto = MarchandiseStatisticsQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID du bureau de sortie',
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], MarchandiseStatisticsQueryDto.prototype, "bureauSortieId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date de début (format ISO)',
        example: '2024-01-01',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], MarchandiseStatisticsQueryDto.prototype, "dateDebut", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date de fin (format ISO)',
        example: '2024-12-31',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], MarchandiseStatisticsQueryDto.prototype, "dateFin", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Limite du nombre de résultats',
        example: 10,
        default: 20,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], MarchandiseStatisticsQueryDto.prototype, "limit", void 0);
class MarchandiseStatisticsItemDto {
}
exports.MarchandiseStatisticsItemDto = MarchandiseStatisticsItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nature de la marchandise',
        example: 'Électronique',
    }),
    __metadata("design:type", String)
], MarchandiseStatisticsItemDto.prototype, "natureMarchandise", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre total de colis',
        example: 125,
    }),
    __metadata("design:type", Number)
], MarchandiseStatisticsItemDto.prototype, "totalColis", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Poids total (kg)',
        example: 15420.5,
        nullable: true,
    }),
    __metadata("design:type", Object)
], MarchandiseStatisticsItemDto.prototype, "poidsTotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Valeur totale déclarée',
        example: 125000000,
        nullable: true,
    }),
    __metadata("design:type", Object)
], MarchandiseStatisticsItemDto.prototype, "valeurTotale", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Poids moyen par colis (kg)',
        example: 123.36,
        nullable: true,
    }),
    __metadata("design:type", Object)
], MarchandiseStatisticsItemDto.prototype, "poidsMoyen", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Valeur moyenne par colis',
        example: 1000000,
        nullable: true,
    }),
    __metadata("design:type", Object)
], MarchandiseStatisticsItemDto.prototype, "valeurMoyenne", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre d\'ordres de mission distincts',
        example: 45,
    }),
    __metadata("design:type", Number)
], MarchandiseStatisticsItemDto.prototype, "nombreOrdres", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Pourcentage du total (%)',
        example: 15.5,
    }),
    __metadata("design:type", Number)
], MarchandiseStatisticsItemDto.prototype, "pourcentage", void 0);
class MarchandiseStatisticsResponseDto {
}
exports.MarchandiseStatisticsResponseDto = MarchandiseStatisticsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Liste des statistiques par nature de marchandise',
        type: [MarchandiseStatisticsItemDto],
    }),
    __metadata("design:type", Array)
], MarchandiseStatisticsResponseDto.prototype, "marchandises", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Totaux généraux',
        example: {
            totalColis: 805,
            poidsTotal: 98754.32,
            valeurTotale: 985000000,
            nombreMarchandisesDistinctes: 15,
        },
    }),
    __metadata("design:type", Object)
], MarchandiseStatisticsResponseDto.prototype, "totaux", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Période de la statistique',
        example: {
            debut: '2024-01-01T00:00:00.000Z',
            fin: '2024-12-31T23:59:59.999Z',
        },
    }),
    __metadata("design:type", Object)
], MarchandiseStatisticsResponseDto.prototype, "periode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Bureau de sortie filtré (si applicable)',
        example: {
            id: 1,
            name: 'Bureau Dakar',
            code: 'BDS-001',
        },
        nullable: true,
    }),
    __metadata("design:type", Object)
], MarchandiseStatisticsResponseDto.prototype, "bureauSortie", void 0);
class MarchandiseByBureauDto {
}
exports.MarchandiseByBureauDto = MarchandiseByBureauDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID du bureau de sortie',
        example: 1,
    }),
    __metadata("design:type", Number)
], MarchandiseByBureauDto.prototype, "bureauSortieId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nom du bureau',
        example: 'Bureau Dakar',
    }),
    __metadata("design:type", String)
], MarchandiseByBureauDto.prototype, "bureauName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Code du bureau',
        example: 'BDS-001',
    }),
    __metadata("design:type", String)
], MarchandiseByBureauDto.prototype, "bureauCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Statistiques des marchandises pour ce bureau',
        type: [MarchandiseStatisticsItemDto],
    }),
    __metadata("design:type", Array)
], MarchandiseByBureauDto.prototype, "marchandises", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total de colis pour ce bureau',
        example: 250,
    }),
    __metadata("design:type", Number)
], MarchandiseByBureauDto.prototype, "totalColis", void 0);
class MarchandiseTrendDto {
}
exports.MarchandiseTrendDto = MarchandiseTrendDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Période (YYYY-MM ou YYYY-MM-DD)',
        example: '2024-01',
    }),
    __metadata("design:type", String)
], MarchandiseTrendDto.prototype, "period", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nature de la marchandise',
        example: 'Électronique',
    }),
    __metadata("design:type", String)
], MarchandiseTrendDto.prototype, "natureMarchandise", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre de colis',
        example: 45,
    }),
    __metadata("design:type", Number)
], MarchandiseTrendDto.prototype, "nombreColis", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Poids total (kg)',
        example: 5420.5,
        nullable: true,
    }),
    __metadata("design:type", Object)
], MarchandiseTrendDto.prototype, "poidsTotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Valeur totale',
        example: 45000000,
        nullable: true,
    }),
    __metadata("design:type", Object)
], MarchandiseTrendDto.prototype, "valeurTotale", void 0);
class DestinationStatisticsQueryDto {
}
exports.DestinationStatisticsQueryDto = DestinationStatisticsQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID du bureau de sortie',
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], DestinationStatisticsQueryDto.prototype, "bureauSortieId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date de début (format ISO)',
        example: '2024-01-01',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], DestinationStatisticsQueryDto.prototype, "dateDebut", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date de fin (format ISO)',
        example: '2024-12-31',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], DestinationStatisticsQueryDto.prototype, "dateFin", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Limite du nombre de résultats',
        example: 10,
        default: 20,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], DestinationStatisticsQueryDto.prototype, "limit", void 0);
class DestinationStatisticsItemDto {
}
exports.DestinationStatisticsItemDto = DestinationStatisticsItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Destination',
        example: 'Port de Dakar',
    }),
    __metadata("design:type", String)
], DestinationStatisticsItemDto.prototype, "destination", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre total de conteneurs',
        example: 45,
    }),
    __metadata("design:type", Number)
], DestinationStatisticsItemDto.prototype, "totalConteneurs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre total de camions',
        example: 32,
    }),
    __metadata("design:type", Number)
], DestinationStatisticsItemDto.prototype, "totalCamions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre total de voitures',
        example: 18,
    }),
    __metadata("design:type", Number)
], DestinationStatisticsItemDto.prototype, "totalVoitures", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre total de véhicules (camions + voitures)',
        example: 50,
    }),
    __metadata("design:type", Number)
], DestinationStatisticsItemDto.prototype, "totalVehicules", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre total de transports (conteneurs + véhicules)',
        example: 95,
    }),
    __metadata("design:type", Number)
], DestinationStatisticsItemDto.prototype, "totalTransports", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre d\'ordres de mission distincts',
        example: 28,
    }),
    __metadata("design:type", Number)
], DestinationStatisticsItemDto.prototype, "nombreOrdres", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Pourcentage du total (%)',
        example: 18.5,
    }),
    __metadata("design:type", Number)
], DestinationStatisticsItemDto.prototype, "pourcentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Moyenne de conteneurs par ordre',
        example: 1.61,
    }),
    __metadata("design:type", Number)
], DestinationStatisticsItemDto.prototype, "moyenneConteneursParOrdre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Moyenne de véhicules par ordre',
        example: 1.79,
    }),
    __metadata("design:type", Number)
], DestinationStatisticsItemDto.prototype, "moyenneVehiculesParOrdre", void 0);
class DestinationStatisticsResponseDto {
}
exports.DestinationStatisticsResponseDto = DestinationStatisticsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Liste des statistiques par destination',
        type: [DestinationStatisticsItemDto],
    }),
    __metadata("design:type", Array)
], DestinationStatisticsResponseDto.prototype, "destinations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Totaux généraux',
        example: {
            totalOrdres: 156,
            totalConteneurs: 312,
            totalCamions: 245,
            totalVoitures: 128,
            totalVehicules: 373,
            totalTransports: 685,
            nombreDestinationsDistinctes: 12,
        },
    }),
    __metadata("design:type", Object)
], DestinationStatisticsResponseDto.prototype, "totaux", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Période de la statistique',
        example: {
            debut: '2024-01-01T00:00:00.000Z',
            fin: '2024-12-31T23:59:59.999Z',
        },
    }),
    __metadata("design:type", Object)
], DestinationStatisticsResponseDto.prototype, "periode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Bureau de sortie filtré (si applicable)',
        example: {
            id: 1,
            name: 'Bureau Dakar',
            code: 'BDS-001',
        },
        nullable: true,
    }),
    __metadata("design:type", Object)
], DestinationStatisticsResponseDto.prototype, "bureauSortie", void 0);
class DestinationByBureauDto {
}
exports.DestinationByBureauDto = DestinationByBureauDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID du bureau de sortie',
        example: 1,
    }),
    __metadata("design:type", Number)
], DestinationByBureauDto.prototype, "bureauSortieId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nom du bureau',
        example: 'Bureau Dakar',
    }),
    __metadata("design:type", String)
], DestinationByBureauDto.prototype, "bureauName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Code du bureau',
        example: 'BDS-001',
    }),
    __metadata("design:type", String)
], DestinationByBureauDto.prototype, "bureauCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Statistiques des destinations pour ce bureau',
        type: [DestinationStatisticsItemDto],
    }),
    __metadata("design:type", Array)
], DestinationByBureauDto.prototype, "destinations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total de transports pour ce bureau',
        example: 285,
    }),
    __metadata("design:type", Number)
], DestinationByBureauDto.prototype, "totalTransports", void 0);
class DestinationTrendDto {
}
exports.DestinationTrendDto = DestinationTrendDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Période (YYYY-MM ou YYYY-MM-DD)',
        example: '2024-01',
    }),
    __metadata("design:type", String)
], DestinationTrendDto.prototype, "period", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Destination',
        example: 'Port de Dakar',
    }),
    __metadata("design:type", String)
], DestinationTrendDto.prototype, "destination", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre de conteneurs',
        example: 45,
    }),
    __metadata("design:type", Number)
], DestinationTrendDto.prototype, "nombreConteneurs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre de camions',
        example: 32,
    }),
    __metadata("design:type", Number)
], DestinationTrendDto.prototype, "nombreCamions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre de voitures',
        example: 18,
    }),
    __metadata("design:type", Number)
], DestinationTrendDto.prototype, "nombreVoitures", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre total de véhicules',
        example: 50,
    }),
    __metadata("design:type", Number)
], DestinationTrendDto.prototype, "nombreVehicules", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre total de transports',
        example: 95,
    }),
    __metadata("design:type", Number)
], DestinationTrendDto.prototype, "nombreTransports", void 0);
class DestinationRouteDto {
}
exports.DestinationRouteDto = DestinationRouteDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Itinéraire',
        example: 'Dakar -> Thiès -> Saint-Louis',
    }),
    __metadata("design:type", String)
], DestinationRouteDto.prototype, "itineraire", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Destination finale',
        example: 'Saint-Louis',
    }),
    __metadata("design:type", String)
], DestinationRouteDto.prototype, "destination", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre d\'ordres sur cet itinéraire',
        example: 15,
    }),
    __metadata("design:type", Number)
], DestinationRouteDto.prototype, "nombreOrdres", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre total de transports',
        example: 45,
    }),
    __metadata("design:type", Number)
], DestinationRouteDto.prototype, "totalTransports", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Pourcentage du total',
        example: 8.5,
    }),
    __metadata("design:type", Number)
], DestinationRouteDto.prototype, "pourcentage", void 0);
//# sourceMappingURL=apurement-statistics.dto.js.map