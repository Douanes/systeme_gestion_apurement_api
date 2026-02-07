import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';

export interface JwtPayload {
    sub: number;
    username: string;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly prisma: PrismaService,
    ) {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secret,
            // Rendre issuer et audience optionnels pour compatibilité avec les tokens existants
            // Les nouveaux tokens incluront ces valeurs, mais les anciens tokens fonctionneront toujours
        });
    }

    /**
     * Valide le payload JWT et retourne l'utilisateur
     */
    async validate(payload: JwtPayload) {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
            select: {
                id: true,
                username: true,
                email: true,
                firstname: true,
                lastname: true,
                role: true,
                isActive: true,
                emailVerified: true,
                deletedAt: true,
                maisonTransits: {
                    where: { deletedAt: null },
                    select: { maisonTransitId: true },
                },
                maisonTransitsOwned: {
                    where: { deletedAt: null },
                    select: { id: true },
                },
            },
        });

        if (!user) {
            throw new UnauthorizedException('Utilisateur non trouvé');
        }

        if (user.deletedAt) {
            throw new UnauthorizedException('Ce compte a été supprimé');
        }

        if (!user.isActive) {
            throw new UnauthorizedException('Ce compte est désactivé');
        }

        // Collecter les IDs des maisons de transit associées
        const maisonTransitIds = [
            ...new Set([
                ...user.maisonTransits.map((mt) => mt.maisonTransitId),
                ...user.maisonTransitsOwned.map((mt) => mt.id),
            ]),
        ];

        // Retourner l'utilisateur sans les champs sensibles
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            role: user.role,
            isActive: user.isActive,
            emailVerified: user.emailVerified,
            maisonTransitIds,
        };
    }
}
