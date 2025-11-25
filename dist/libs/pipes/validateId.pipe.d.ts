import { PipeTransform } from '@nestjs/common';
export declare class ValidateUUIDPipe implements PipeTransform<string> {
    transform(value: string): string;
    private isValidUUID;
}
