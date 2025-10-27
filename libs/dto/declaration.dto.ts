import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsString, IsNumber, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

enum EtatApurement {
  apure = 'apure',
  apure_se = 'apure_se',
  non_apure = 'non_apure',
  rejetter = 'rejetter'
}

export class CreateDeclarationDto {
  @ApiProperty({ description: 'Numéro d\'ordre', example: 1344 })
  @IsInt()
  @IsNotEmpty()
  num_ordre: number;

  @ApiProperty({ description: 'Numéro de déclaration', example: "15T 13333" })
  @IsString()
  @IsNotEmpty()
  num_declaration: string;

  @ApiProperty({ description: 'Nombre de colis', example: 344 })
  @IsInt()
  @IsNotEmpty()
  nbre_colis: number;

  @ApiProperty({ description: 'Poids', example: 12344 })
  @IsNumber()
  @IsNotEmpty()
  poids: number;

  @ApiProperty({ description: 'Description de la marchandise', example: "Carreaux" })
  @IsString()
  @IsNotEmpty()
  marchandise: string;

  @ApiProperty({ description: 'Nom du dépositaire', example: "Baba Ngom" })
  @IsString()
  @IsNotEmpty()
  depositaire: string;

  @ApiProperty({ description: 'Numéro de téléphone', example: "+221772050626" })
  @IsString()
  @IsNotEmpty()
  telephone: string;

  @ApiProperty({ description: 'État d\'apurement', enum: EtatApurement, example: 'non_apure' })
  @IsEnum(EtatApurement)
  @IsOptional()
  etatApurement?: EtatApurement;

  @ApiProperty({ description: 'ID du régime', example: 1 })
  @IsInt()
  @IsNotEmpty()
  regimeId: number;
}

export class UpdateDeclarationDto extends PartialType(CreateDeclarationDto) {}

export class DeclarationResponseDto extends CreateDeclarationDto {
  @ApiProperty({
    description: 'ID du declaration',
    example: 1,
  })
  @IsInt()
  id: number;

  @ApiProperty({
    description: 'Date de création',
    example: '2024-11-21T10:00:00Z',
  })
  created_at: string;

  @ApiProperty({
    description: 'Date de mise à jour',
    example: '2024-11-21T10:00:00Z',
  })
  updated_at: string;
}