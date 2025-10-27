import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsString, IsNotEmpty } from 'class-validator';

export class CreateMaisonTransitDto {
  @ApiProperty({ example: 'Transit Express', description: 'Nom de la maison de transit' })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiProperty({ example: 'Société spécialisée dans le transit international', description: 'Description de la maison de transit' })
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class UpdateMaisonTransitDto extends PartialType(CreateMaisonTransitDto) {}

export class MaisonTransitResponseDto extends CreateMaisonTransitDto {
  @ApiProperty({
    description: 'ID du maison de transit',
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