import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    Get,
    Query,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiQuery,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
    RegisterTransitHouseDto,
    LoginDto,
    LoginResponseDto,
    RegisterResponseDto,
    VerifyEmailDto,
    VerifyEmailResponseDto,
    ResendVerificationEmailDto,
} from 'libs/dto/auth';
import { ErrorResponseDto } from 'libs/dto/global/response.dto';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Inscription d\'une maison de transit',
        description:
            'Créer un nouveau compte utilisateur et une maison de transit associée. ' +
            'Un email de vérification sera envoyé à l\'adresse fournie. ' +
            'Le compte sera activé après vérification de l\'email.',
    })
    @ApiBody({ type: RegisterTransitHouseDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Inscription réussie',
        type: RegisterResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Email, username ou code maison transit déjà utilisé',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Données invalides',
        type: ErrorResponseDto,
    })
    async register(
        @Body() registerDto: RegisterTransitHouseDto,
    ): Promise<RegisterResponseDto> {
        return this.authService.registerTransitHouse(registerDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Connexion',
        description:
            'Se connecter avec un nom d\'utilisateur (ou email) et un mot de passe. ' +
            'Retourne un token JWT pour les requêtes authentifiées.',
    })
    @ApiBody({ type: LoginDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Connexion réussie',
        type: LoginResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Identifiants incorrects ou compte non activé',
        type: ErrorResponseDto,
    })
    async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
        return this.authService.login(loginDto);
    }

    @Get('verify-email')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Vérifier l\'email',
        description:
            'Vérifier l\'adresse email avec le token reçu par email. ' +
            'Active automatiquement le compte après vérification.',
    })
    @ApiQuery({
        name: 'token',
        description: 'Token de vérification reçu par email',
        type: String,
        required: true,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Email vérifié avec succès',
        type: VerifyEmailResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Token invalide',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Token déjà utilisé ou expiré',
        type: ErrorResponseDto,
    })
    async verifyEmail(@Query('token') token: string): Promise<VerifyEmailResponseDto> {
        return this.authService.verifyEmail(token);
    }

    @Post('resend-verification')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Renvoyer l\'email de vérification',
        description:
            'Renvoyer un nouvel email de vérification si le précédent a expiré ou n\'a pas été reçu.',
    })
    @ApiBody({ type: ResendVerificationEmailDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Email renvoyé avec succès',
        schema: {
            example: {
                message: 'Un nouvel email de vérification a été envoyé',
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Aucun compte trouvé avec cet email',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Email déjà vérifié ou impossible d\'envoyer l\'email',
        type: ErrorResponseDto,
    })
    async resendVerification(
        @Body() resendDto: ResendVerificationEmailDto,
    ): Promise<{ message: string }> {
        return this.authService.resendVerificationEmail(resendDto.email);
    }
}
