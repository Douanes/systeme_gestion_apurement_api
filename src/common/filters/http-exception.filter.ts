import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: string | string[] = 'Erreur interne du serveur';
        let error = 'Internal Server Error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
                error = exception.name;
            } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                const responseObj = exceptionResponse as any;
                message = responseObj.message || exception.message;
                error = responseObj.error || exception.name;
            }
        } else if (exception instanceof Error) {
            message = exception.message;
            error = exception.name;

            // Log l'erreur complète pour le débogage
            this.logger.error(
                `Unhandled exception: ${exception.message}`,
                exception.stack,
            );
        } else {
            // Pour les erreurs inconnues
            this.logger.error('Unknown exception type', exception);
        }

        const errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            error,
            message,
        };

        // Log seulement les erreurs 500 (erreurs serveur)
        if (status >= 500) {
            this.logger.error(
                `HTTP ${status} Error: ${request.method} ${request.url}`,
                JSON.stringify(errorResponse),
            );
        } else {
            // Pour les erreurs client (4xx), log en niveau warn
            this.logger.warn(
                `HTTP ${status} Error: ${request.method} ${request.url} - ${message}`,
            );
        }

        response.status(status).json(errorResponse);
    }
}
