import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    Get,
    Query,
    BadRequestException,
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
    ActivateAccountDto,
    InvitationInfoDto,
    AcceptInvitationDto,
} from 'libs/dto/auth';
import {
    ForgotPasswordDto,
    ResetPasswordDto,
} from 'libs/dto/profile';
import { ErrorResponseDto } from 'libs/dto/global/response.dto';
import { Public } from './decorators';

@ApiTags('Authentification')
@Public() // Toutes les routes d'authentification sont publiques
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
            'Renvoyer un nouvel email de vérification si le précédent a expiré ou n\'a pas été reçu. ' +
            'Pour des raisons de sécurité (OWASP - Prévention de l\'énumération d\'utilisateurs), ' +
            'cette route retourne toujours un message de succès, que l\'email existe ou non.',
    })
    @ApiBody({ type: ResendVerificationEmailDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Message de succès (retourné dans tous les cas pour éviter l\'énumération d\'utilisateurs)',
        schema: {
            example: {
                message: 'Si un compte avec cet email existe et n\'est pas encore vérifié, un email de vérification a été envoyé.',
            },
        },
    })
    async resendVerification(
        @Body() resendDto: ResendVerificationEmailDto,
    ): Promise<{ message: string }> {
        return this.authService.resendVerificationEmail(resendDto.email);
    }

    @Post('activate-account')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Activer un compte et définir le mot de passe',
        description:
            'Permet à un agent (ou autre utilisateur) d\'activer son compte ' +
            'en utilisant le token reçu par email et en définissant son mot de passe. ' +
            'Le compte est automatiquement activé et un JWT est retourné pour connexion automatique.',
    })
    @ApiBody({ type: ActivateAccountDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Compte activé avec succès, JWT retourné',
        type: LoginResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Token invalide ou expiré',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Token déjà utilisé ou expiré',
        type: ErrorResponseDto,
    })
    async activateAccount(
        @Body() activateAccountDto: ActivateAccountDto,
    ): Promise<LoginResponseDto> {
        return this.authService.activateAccount(
            activateAccountDto.token,
            activateAccountDto.password,
        );
    }

    @Get('maison-transit/verify-invitation')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Vérifier un token d\'invitation MT',
        description:
            'Vérifie la validité d\'un token d\'invitation pour rejoindre une maison de transit ' +
            'et retourne les informations de l\'invitation (email, nom MT, rôle, inviteur).',
    })
    @ApiQuery({
        name: 'token',
        description: 'Token d\'invitation reçu par email',
        type: String,
        required: true,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Informations de l\'invitation',
        type: InvitationInfoDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Token d\'invitation invalide',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Token déjà utilisé ou expiré',
        type: ErrorResponseDto,
    })
    async verifyInvitation(@Query('token') token: string): Promise<InvitationInfoDto> {
        return this.authService.verifyInvitationToken(token);
    }

    @Post('maison-transit/accept-invitation')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Accepter une invitation MT et créer son compte',
        description:
            'Permet à un utilisateur invité d\'accepter l\'invitation en créant son compte. ' +
            'L\'utilisateur choisit son username et son mot de passe. ' +
            'Le compte est automatiquement activé et lié à la maison de transit. ' +
            'Un JWT est retourné pour connexion automatique.',
    })
    @ApiBody({ type: AcceptInvitationDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Invitation acceptée, compte créé avec succès, JWT retourné',
        type: LoginResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Token d\'invitation invalide',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Token déjà utilisé ou expiré',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Username ou email déjà utilisé',
        type: ErrorResponseDto,
    })
    async acceptInvitation(
        @Body() acceptInvitationDto: AcceptInvitationDto,
    ): Promise<LoginResponseDto> {
        return this.authService.acceptInvitation(acceptInvitationDto);
    }

    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Demander la réinitialisation du mot de passe',
        description:
            'Envoie un email avec un lien de réinitialisation du mot de passe. ' +
            'Le lien expire après 1 heure. ' +
            'Pour des raisons de sécurité, le même message est retourné que l\'email existe ou non.',
    })
    @ApiBody({ type: ForgotPasswordDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Email de réinitialisation envoyé (si le compte existe)',
        schema: {
            example: {
                message: 'Si un compte avec cet email existe, un lien de réinitialisation a été envoyé.',
            },
        },
    })
    async forgotPassword(
        @Body() forgotPasswordDto: ForgotPasswordDto,
    ): Promise<{ message: string }> {
        return this.authService.forgotPassword(forgotPasswordDto.email);
    }

    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Réinitialiser le mot de passe',
        description:
            'Réinitialise le mot de passe avec le token reçu par email. ' +
            'Le token expire après 1 heure et ne peut être utilisé qu\'une seule fois.',
    })
    @ApiBody({ type: ResetPasswordDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Mot de passe réinitialisé avec succès',
        schema: {
            example: {
                message: 'Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.',
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Token invalide ou expiré',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Token déjà utilisé ou mots de passe ne correspondent pas',
        type: ErrorResponseDto,
    })
    async resetPassword(
        @Body() resetPasswordDto: ResetPasswordDto,
    ): Promise<{ message: string }> {
        // Vérifier que les mots de passe correspondent
        if (resetPasswordDto.newPassword !== resetPasswordDto.confirmPassword) {
            throw new BadRequestException('Les mots de passe ne correspondent pas');
        }

        return this.authService.resetPassword(
            resetPasswordDto.token,
            resetPasswordDto.newPassword,
        );
    }
}
