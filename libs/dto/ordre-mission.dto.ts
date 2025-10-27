import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsString, IsNotEmpty, IsEnum, IsOptional, IsNumber, IsArray } from 'class-validator';

enum EtatApurement {
  apure = 'apure',
  apure_se = 'apure_se',
  non_apure = 'non_apure',
  rejetter = 'rejetter'
}

export class CreateOrdreMissionDto {
  @ApiProperty({ description: 'Numéro d\'ordre de mission', example: 'OM-2025-0001' })
  @IsString()
  @IsNotEmpty()
  numeroOrdre: string;

  @ApiProperty({ description: 'Date de l\'ordre de mission', example: '2025-03-15' })
  @IsString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ description: 'Poids total', example: 1250.5 })
  @IsNumber()
  @IsNotEmpty()
  poidsTotal: number;

  @ApiProperty({ description: 'Nombre total de colis', example: 15 })
  @IsInt()
  @IsNotEmpty()
  nombreColisTotal: number;

  @ApiProperty({ description: 'Natures des marchandises', example: ['Produits alimentaires', 'Textile et vêtements'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  naturesMarchandises: string[];

  @ApiProperty({ description: 'Nom du dépositaire', example: 'ABDOU NDAYE' })
  @IsString()
  @IsNotEmpty()
  depositaire: string;

  @ApiProperty({ description: 'Numéro de téléphone du dépositaire', example: '+221 77 123 45 67' })
  @IsString()
  @IsNotEmpty()
  telephone_dep: string;

  @ApiProperty({ description: 'État d\'apurement', enum: EtatApurement, example: 'non_apure' })
  @IsEnum(EtatApurement)
  @IsOptional()
  etatApurement?: EtatApurement;

  @ApiProperty({ description: 'ID du bureau de sortie', example: 1 })
  @IsInt()
  @IsNotEmpty()
  bureauSortieId: number;

  @ApiProperty({ description: 'ID de l\'escouade', example: 1 })
  @IsInt()
  @IsNotEmpty()
  escouadeId: number;

  @ApiProperty({ description: 'ID de la maison de transit', example: 1 })
  @IsInt()
  @IsNotEmpty()
  maisonId: number;
}

export class UpdateOrdreMissionDto extends PartialType(CreateOrdreMissionDto) {}

export class OrdreMissionResponseDto extends CreateOrdreMissionDto {
  @ApiProperty({
    description: 'ID de l\'ordre de mission',
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
