import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsString, IsNotEmpty } from 'class-validator';

export class CreateRegimeDto {
  @ApiProperty({ example: 'Exportation', description: 'Libellé du régime' })
  @IsString()
  @IsNotEmpty()
  libelle: string;
}

export class UpdateRegimeDto extends PartialType(CreateRegimeDto) {}

export class RegimeResponseDto extends CreateRegimeDto {
  @ApiProperty({
    description: 'ID du regime',
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