import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsInt,
    IsDateString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class CreateEscouadeDto {
    @ApiProperty({
        description: 'Nom unique de l\'escouade',
        example: 'Escouade Alpha',
        minLength: 2,
        maxLength: 255,
    })
    @IsString()
    @IsNotEmpty({ message: 'Le nom de l\'escouade est requis' })
    @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères' })
    @MaxLength(255, { message: 'Le nom ne peut pas dépasser 255 caractères' })
    name: string;

    @ApiPropertyOptional({
        description: 'Description de l\'escouade',
        example: 'Escouade spécialisée dans les contrôles frontaliers',
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({
        description: 'Date de mise en service opérationnel',
        example: '2024-01-15',
    })
    @IsOptional()
    @IsDateString()
    operationalDate?: string;

    @ApiPropertyOptional({
        description: 'ID du chef d\'escouade',
        example: 1,
    })
    @IsOptional()
    @IsInt()
    chefId?: number;

    @ApiPropertyOptional({
        description: 'ID de l\'adjoint du chef d\'escouade',
        example: 2,
    })
    @IsOptional()
    @IsInt()
    adjointId?: number;
}

export class UpdateEscouadeDto extends PartialType(CreateEscouadeDto) { }

export class EscouadeResponseDto {
    @ApiProperty({
        description: 'ID unique de l\'escouade',
        example: 1,
    })
    id: number;

    @ApiProperty({
        description: 'Nom de l\'escouade',
        example: 'Escouade Alpha',
    })
    name: string;

    @ApiPropertyOptional({
        description: 'Description',
        example: 'Escouade spécialisée dans les contrôles frontaliers',
        nullable: true,
    })
    description?: string | null;

    @ApiPropertyOptional({
        description: 'Date de mise en service opérationnel',
        example: '2024-01-15T00:00:00.000Z',
        nullable: true,
    })
    operationalDate?: Date | null;

    @ApiPropertyOptional({
        description: 'ID du chef d\'escouade',
        example: 1,
        nullable: true,
    })
    chefId?: number | null;

    @ApiPropertyOptional({
        description: 'ID de l\'adjoint',
        example: 2,
        nullable: true,
    })
    adjointId?: number | null;

    @ApiProperty({
        description: 'Date de création',
        example: '2024-01-15T10:30:00.000Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Date de dernière modification',
        example: '2024-01-15T10:30:00.000Z',
    })
    updatedAt: Date;
}

export class EscouadeWithRelationsDto extends EscouadeResponseDto {
    @ApiPropertyOptional({
        description: 'Chef de l\'escouade',
    })
    chef?: any;

    @ApiPropertyOptional({
        description: 'Adjoint du chef',
    })
    adjoint?: any;

    @ApiPropertyOptional({
        description: 'Liste des agents membres de l\'escouade',
        type: 'array',
        isArray: true,
    })
    escouadeAgents?: any[];
}

export class AddAgentToEscouadeDto {
    @ApiProperty({
        description: 'ID de l\'agent à ajouter',
        example: 1,
    })
    @IsInt()
    @IsNotEmpty({ message: 'L\'ID de l\'agent est requis' })
    agentId: number;
}

export class RemoveAgentFromEscouadeDto {
    @ApiProperty({
        description: 'ID de l\'agent à retirer',
        example: 1,
    })
    @IsInt()
    @IsNotEmpty({ message: 'L\'ID de l\'agent est requis' })
    agentId: number;
}