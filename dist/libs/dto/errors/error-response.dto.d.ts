export declare class ErrorResponseDto {
    statusCode: number;
    message: string;
    errors: Record<string, string[]>;
}
export declare class ConflictResponseDto {
    statusCode: number;
    message: string;
}
export declare class NotFoundResponseDto {
    statusCode: number;
    message: string;
}
