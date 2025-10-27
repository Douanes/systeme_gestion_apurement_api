import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

enum Statut {
  actif = 'actif',
  inactif = 'inactif'
}

export class CreateAgentDto {
  @ApiProperty({ description: 'Nom de l\'agent', example: 'Diop' })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiProperty({ description: 'Prénom de l\'agent', example: 'Mamadou' })
  @IsString()
  @IsNotEmpty()
  prenom: string;

  @ApiProperty({ description: 'Matricule de l\'agent', example: 'AGT-2024-001' })
  @IsString()
  @IsNotEmpty()
  matricule: string;

  @ApiProperty({ description: 'Numéro de téléphone', example: '+221 77 123 45 67' })
  @IsString()
  @IsNotEmpty()
  telephone: string;

  @ApiProperty({ description: 'Grade de l\'agent', example: 'Agent Senior' })
  @IsString()
  @IsNotEmpty()
  grade: string;

  @ApiProperty({ description: 'Date d\'affectation', example: '2024-01-15' })
  @IsString()
  @IsNotEmpty()
  dateAffectation: string;

  @ApiProperty({ description: 'Statut de l\'agent', enum: Statut, example: 'actif' })
  @IsEnum(Statut)
  @IsOptional()
  statut?: Statut;
}

export class UpdateAgentDto extends PartialType(CreateAgentDto) {}

export class AgentResponseDto extends CreateAgentDto {
  @ApiProperty({
    description: 'ID de l\'agent',
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
