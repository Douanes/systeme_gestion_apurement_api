import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

enum Statut {
  actif = 'actif',
  inactif = 'inactif'
}

export class CreateBureauSortieDto {
  @ApiProperty({ description: 'Nom du bureau de sortie', example: 'DP WORLD' })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiProperty({ description: 'Code du bureau', example: 'DPW-001' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Ville', example: 'Dakar' })
  @IsString()
  @IsNotEmpty()
  ville: string;

  @ApiProperty({ description: 'Région', example: 'Dakar' })
  @IsString()
  @IsNotEmpty()
  region: string;

  @ApiProperty({ description: 'Statut du bureau', enum: Statut, example: 'actif' })
  @IsEnum(Statut)
  @IsOptional()
  statut?: Statut;
}

export class UpdateBureauSortieDto extends PartialType(CreateBureauSortieDto) {}

export class BureauSortieResponseDto extends CreateBureauSortieDto {
  @ApiProperty({
    description: 'ID du bureau de sortie',
    example: 1,
  })
  @IsInt()
  id: number;

  @ApiProperty({
    description: 'Date de création',
    example: '2024-11-21T10:00:00Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Date de mise à jour',
    example: '2024-11-21T10:00:00Z',
  })
  updatedAt: string;
}
