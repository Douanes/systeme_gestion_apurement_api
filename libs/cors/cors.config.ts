import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export function getCorsConfig(): CorsOptions {
    return {
        origin: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        credentials: true,
        allowedHeaders: [
            'Content-Type', 
            'Authorization',
            'Accept',
            'Origin',
            'X-Requested-With'
        ],
        exposedHeaders: ['Authorization'],
        maxAge: 3600
    };
}