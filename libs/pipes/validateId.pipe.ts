import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidateUUIDPipe implements PipeTransform<string> {
  transform(value: string): string {
    if (!this.isValidUUID(value)) {
      throw new BadRequestException('Validation failed (UUID is expected)');
    }
    return value;
  }

  private isValidUUID(value: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }
}
