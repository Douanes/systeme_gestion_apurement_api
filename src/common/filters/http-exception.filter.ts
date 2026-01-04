import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

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

        // Gestion spécifique des erreurs Prisma
        if (this.isPrismaError(exception)) {
            const prismaError = this.handlePrismaError(exception);
            status = prismaError.status;
            message = prismaError.message;
            error = prismaError.error;

            // Logger l'erreur Prisma complète pour le débogage
            this.logger.error(
                `Prisma Error [${exception.code}]: ${exception.message}`,
                {
                    code: exception.code,
                    meta: exception.meta,
                    stack: exception.stack,
                    path: request.url,
                    method: request.method,
                },
            );
        } else if (exception instanceof HttpException) {
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

    private isPrismaError(exception: unknown): exception is Prisma.PrismaClientKnownRequestError {
        return (
            typeof exception === 'object' &&
            exception !== null &&
            'code' in exception &&
            'meta' in exception &&
            exception.constructor.name === 'PrismaClientKnownRequestError'
        );
    }

    private handlePrismaError(exception: Prisma.PrismaClientKnownRequestError): {
        status: number;
        message: string;
        error: string;
    } {
        switch (exception.code) {
            case 'P2002':
                // Violation de contrainte unique
                const target = (exception.meta?.target as string[]) || [];
                const field = target[0] || 'champ';
                return {
                    status: HttpStatus.CONFLICT,
                    message: `Une entrée avec ce ${this.translateField(field)} existe déjà`,
                    error: 'Conflict',
                };

            case 'P2025':
                // Enregistrement non trouvé
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: 'Enregistrement non trouvé',
                    error: 'Not Found',
                };

            case 'P2003':
                // Violation de clé étrangère
                return {
                    status: HttpStatus.BAD_REQUEST,
                    message: 'Référence invalide - l\'élément lié n\'existe pas',
                    error: 'Bad Request',
                };

            case 'P2014':
                // Violation de relation
                return {
                    status: HttpStatus.BAD_REQUEST,
                    message: 'Impossible de modifier car d\'autres enregistrements dépendent de celui-ci',
                    error: 'Bad Request',
                };

            case 'P2000':
                // Valeur trop longue
                return {
                    status: HttpStatus.BAD_REQUEST,
                    message: 'La valeur fournie est trop longue pour le champ',
                    error: 'Bad Request',
                };

            case 'P2001':
                // Enregistrement recherché non trouvé
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: 'L\'enregistrement recherché n\'existe pas',
                    error: 'Not Found',
                };

            case 'P2015':
                // Enregistrement lié non trouvé
                return {
                    status: HttpStatus.BAD_REQUEST,
                    message: 'Un enregistrement lié requis n\'a pas été trouvé',
                    error: 'Bad Request',
                };

            case 'P2016':
                // Erreur d'interprétation de requête
                return {
                    status: HttpStatus.BAD_REQUEST,
                    message: 'Erreur dans la requête - vérifiez les paramètres',
                    error: 'Bad Request',
                };

            default:
                // Erreur Prisma générique
                return {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Une erreur est survenue lors du traitement de votre requête',
                    error: 'Database Error',
                };
        }
    }

    private translateField(field: string): string {
        const translations: Record<string, string> = {
            numero_declaration: 'numéro de déclaration',
            number: 'numéro',
            immatriculation: 'immatriculation',
            num_conteneur: 'numéro de conteneur',
            chassis: 'numéro de châssis',
            email: 'adresse email',
            phone: 'numéro de téléphone',
            name: 'nom',
        };

        return translations[field] || field;
    }
}
