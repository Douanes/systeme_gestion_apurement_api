import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateRegimeDto {
  @ApiProperty({
    description: 'Nom du régime douanier',
    example: 'Transit ordinaire',
    minLength: 2,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty({ message: 'Le nom du régime est requis' })
  @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères' })
  @MaxLength(255, { message: 'Le nom ne peut pas dépasser 255 caractères' })
  name: string;

  @ApiPropertyOptional({
    description: 'Description détaillée du régime',
    example: 'Régime permettant le transit de marchandises sous douane',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Nombre maximum de nature de marchandise pour ce régime',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  nbreNatureMarchandise?: number;
}

export class UpdateRegimeDto extends PartialType(CreateRegimeDto) { }

export class RegimeResponseDto {
  @ApiProperty({
    description: 'ID unique du régime',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nom du régime douanier',
    example: 'R110',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Description du régime',
    example: 'Régime permettant le transit de marchandises sous douane',
  })
  description?: string | null;

  @ApiPropertyOptional({
    description: 'Nombre maximum de nature de marchandise pour ce régime',
    example: 2,
  })
  nbreNatureMarchandise?: number | null;

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