import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: 400, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({ example: 'Validation failed', description: 'Error message summary' })
  message: string;

  @ApiProperty({
    example: {
      field1: ['Field1 is required.'],
      field2: ['Field2 must be a valid email.'],
    },
    description: 'Detailed validation errors',
  })
  errors: Record<string, string[]>;
}

export class ConflictResponseDto {
  @ApiProperty({ example: 409, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({ example: 'ce nom existe déjà', description: 'Error message summary' })
  message: string;

}

export class NotFoundResponseDto {
  @ApiProperty({ example: 404, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({ example: 'Not found', description: 'Error message summary' })
  message: string;

}