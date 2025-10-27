import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsString, IsNotEmpty, IsEnum, IsOptional, IsArray } from 'class-validator';

enum Statut {
  actif = 'actif',
  inactif = 'inactif'
}

export class CreateEscouadeDto {
  @ApiProperty({ description: 'Nom de l\'escouade', example: 'Escouade Alpha' })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiProperty({ description: 'Description de l\'escouade', example: 'Escouade spécialisée dans la surveillance portuaire' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Statut de l\'escouade', enum: Statut, example: 'inactif' })
  @IsEnum(Statut)
  @IsOptional()
  statut?: Statut;

  @ApiProperty({ description: 'Date de création', example: '2024-01-15' })
  @IsString()
  @IsNotEmpty()
  dateCreation: string;

  @ApiProperty({ description: 'ID du chef d\'escouade', example: 1, required: false })
  @IsInt()
  @IsOptional()
  chefId?: number;

  @ApiProperty({ description: 'ID de l\'adjoint', example: 2, required: false })
  @IsInt()
  @IsOptional()
  adjointId?: number;

  @ApiProperty({
    description: 'IDs agents',
    example: [1, 2, 3]
  })
  @IsArray()
  @IsOptional()
  agents?: number[];
}

export class UpdateEscouadeDto extends PartialType(CreateEscouadeDto) {}

export class EscouadeResponseDto extends CreateEscouadeDto {
  @ApiProperty({
    description: 'ID de l\'escouade',
    example: 1,
  })
  @IsInt()
  id: number;

  @ApiProperty({
    description: 'Date de création système',
    example: '2024-11-21T10:00:00Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Date de mise à jour',
    example: '2024-11-21T10:00:00Z',
  })
  updatedAt: string;
}
