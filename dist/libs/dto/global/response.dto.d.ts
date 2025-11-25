export declare class PaginationMetaDto {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}
export declare class PaginatedResponseDto<T> {
    data: T[];
    meta: PaginationMetaDto;
}
export declare class SuccessResponseDto<T> {
    success: boolean;
    message: string;
    data?: T;
}
export declare class ErrorResponseDto {
    success: boolean;
    message: string;
    statusCode: number;
    timestamp: string;
    path: string;
    errors?: any[];
}
