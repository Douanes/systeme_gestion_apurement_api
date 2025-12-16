import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);
    private transporter: nodemailer.Transporter;

    constructor(private readonly configService: ConfigService) {
        this.createTransporter();
    }

    /**
     * Créer le transporteur Nodemailer
     */
    private createTransporter() {
        const mailConfig = {
            host: this.configService.get<string>('MAIL_HOST', 'smtp.gmail.com'),
            port: this.configService.get<number>('MAIL_PORT', 587),
            secure: this.configService.get<boolean>('MAIL_SECURE', false), // true for 465, false for other ports
            auth: {
                user: this.configService.get<string>('MAIL_USER'),
                pass: this.configService.get<string>('MAIL_PASSWORD'),
            },
        };

        this.transporter = nodemailer.createTransport(mailConfig);

        // Vérifier la configuration
        this.transporter.verify((error) => {
            if (error) {
                this.logger.error('Erreur de configuration du service mail:', error);
            } else {
                this.logger.log('Service mail configuré avec succès');
            }
        });
    }

    /**
     * Envoyer un email de vérification
     */
    async sendVerificationEmail(
        to: string,
        username: string,
        verificationToken: string,
    ): Promise<void> {
        const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
        const verificationUrl = `${frontendUrl}/verify-email?token=${verificationToken}`;

        const mailOptions = {
            from: `"${this.configService.get<string>('MAIL_FROM_NAME', 'Système Apurement')}" <${this.configService.get<string>('MAIL_FROM_ADDRESS')}>`,
            to,
            subject: 'Vérification de votre adresse email',
            html: this.getVerificationEmailTemplate(username, verificationUrl, verificationToken),
        };

        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Email de vérification envoyé à ${to}`);
        } catch (error) {
            this.logger.error(`Erreur lors de l'envoi de l'email à ${to}:`, error);
            throw new Error('Impossible d\'envoyer l\'email de vérification');
        }
    }

    /**
     * Envoyer un email de réinitialisation de mot de passe
     */
    async sendPasswordResetEmail(
        to: string,
        username: string,
        resetToken: string,
    ): Promise<void> {
        const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
        const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: `"${this.configService.get<string>('MAIL_FROM_NAME', 'Système Apurement')}" <${this.configService.get<string>('MAIL_FROM_ADDRESS')}>`,
            to,
            subject: 'Réinitialisation de votre mot de passe',
            html: this.getPasswordResetEmailTemplate(username, resetUrl, resetToken),
        };

        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Email de réinitialisation envoyé à ${to}`);
        } catch (error) {
            this.logger.error(`Erreur lors de l'envoi de l'email à ${to}:`, error);
            throw new Error('Impossible d\'envoyer l\'email de réinitialisation');
        }
    }

    /**
     * Envoyer un email de bienvenue
     */
    async sendWelcomeEmail(to: string, username: string): Promise<void> {
        const mailOptions = {
            from: `"${this.configService.get<string>('MAIL_FROM_NAME', 'Système Apurement')}" <${this.configService.get<string>('MAIL_FROM_ADDRESS')}>`,
            to,
            subject: 'Bienvenue sur le Système de Gestion d\'Apurement',
            html: this.getWelcomeEmailTemplate(username),
        };

        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Email de bienvenue envoyé à ${to}`);
        } catch (error) {
            this.logger.error(`Erreur lors de l'envoi de l'email à ${to}:`, error);
            // Ne pas throw ici, c'est un email optionnel
        }
    }

    /**
     * Template HTML pour l'email de vérification
     */
    private getVerificationEmailTemplate(
        username: string,
        verificationUrl: string,
        token: string,
    ): string {
        return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vérification de votre email</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 30px; }
        .button { display: inline-block; padding: 12px 30px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        .token { background-color: #e8e8e8; padding: 10px; border-radius: 5px; font-family: monospace; word-break: break-all; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Vérification de votre adresse email</h1>
        </div>
        <div class="content">
            <h2>Bonjour ${username},</h2>
            <p>Merci de vous être inscrit sur le Système de Gestion d'Apurement.</p>
            <p>Pour activer votre compte, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :</p>
            <p style="text-align: center;">
                <a href="${verificationUrl}" class="button">Vérifier mon email</a>
            </p>
            <p>Si le bouton ne fonctionne pas, vous pouvez copier et coller le lien suivant dans votre navigateur :</p>
            <p class="token">${verificationUrl}</p>
            <p><strong>Ce lien expire dans 24 heures.</strong></p>
            <p>Si vous n'avez pas créé de compte, ignorez simplement cet email.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Système de Gestion d'Apurement. Tous droits réservés.</p>
        </div>
    </div>
</body>
</html>
        `;
    }

    /**
     * Template HTML pour l'email de réinitialisation de mot de passe
     */
    private getPasswordResetEmailTemplate(
        username: string,
        resetUrl: string,
        token: string,
    ): string {
        return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialisation de mot de passe</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #FF5722; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 30px; }
        .button { display: inline-block; padding: 12px 30px; background-color: #FF5722; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        .token { background-color: #e8e8e8; padding: 10px; border-radius: 5px; font-family: monospace; word-break: break-all; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Réinitialisation de mot de passe</h1>
        </div>
        <div class="content">
            <h2>Bonjour ${username},</h2>
            <p>Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte.</p>
            <p>Pour réinitialiser votre mot de passe, cliquez sur le bouton ci-dessous :</p>
            <p style="text-align: center;">
                <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
            </p>
            <p>Si le bouton ne fonctionne pas, vous pouvez copier et coller le lien suivant dans votre navigateur :</p>
            <p class="token">${resetUrl}</p>
            <p><strong>Ce lien expire dans 1 heure.</strong></p>
            <p><strong>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email et votre mot de passe restera inchangé.</strong></p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Système de Gestion d'Apurement. Tous droits réservés.</p>
        </div>
    </div>
</body>
</html>
        `;
    }

    /**
     * Template HTML pour l'email de bienvenue
     */
    private getWelcomeEmailTemplate(username: string): string {
        return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenue</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 30px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Bienvenue !</h1>
        </div>
        <div class="content">
            <h2>Bonjour ${username},</h2>
            <p>Votre compte a été activé avec succès !</p>
            <p>Vous pouvez maintenant accéder à toutes les fonctionnalités du Système de Gestion d'Apurement.</p>
            <p>Si vous avez des questions ou besoin d'aide, n'hésitez pas à nous contacter.</p>
            <p>Merci de votre confiance !</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Système de Gestion d'Apurement. Tous droits réservés.</p>
        </div>
    </div>
</body>
</html>
        `;
    }
}
