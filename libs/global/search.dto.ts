import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsOptional, IsIn, IsInt, IsNotEmpty, ValidateNested, IsDateString } from 'class-validator';

export class SearchDto {
  @ApiPropertyOptional({ description: 'search by name' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({
    enum: ['name', 'created_at'],
    description: 'Trie par nom, date de modification',
  })
  @IsOptional()
  @IsIn(['name', 'created_at'])
  order_by?: string = 'created_at';

  @ApiPropertyOptional({
    enum: ['asc', 'desc'],
    description: 'Direction du tri',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order_dir?: 'asc' | 'desc' = 'desc';

  @ApiPropertyOptional({ description: 'Nombre limite de résultats' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({ description: 'Décalage pour la pagination' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  offset?: number;
}