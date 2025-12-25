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
        const host = this.configService.get<string>('SMTP_HOST', 'smtp.gmail.com');
        const port = parseInt(this.configService.get<string>('SMTP_PORT', '587'), 10);
        const secure = this.configService.get<string>('SMTP_SECURE', 'false') === 'true';
        const user = this.configService.get<string>('SMTP_USER');
        const pass = this.configService.get<string>('SMTP_PASS');

        const mailConfig = {
            host,
            port,
            secure, // true for 465, false for other ports
            auth: {
                user,
                pass,
            },
        };

        this.logger.log(`Configuration SMTP: host=${host}, port=${port}, secure=${secure}, user=${user ? '***' : 'NOT SET'}, pass=${pass ? '***' : 'NOT SET'}`);

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
            from: this.configService.get<string>('SMTP_FROM', 'noreply@example.com'),
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
            from: this.configService.get<string>('SMTP_FROM', 'noreply@example.com'),
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
            from: this.configService.get<string>('SMTP_FROM', 'noreply@example.com'),
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

    /**
     * Envoyer un email d'activation de compte pour un agent
     */
    async sendAgentActivationEmail(
        to: string,
        firstname: string,
        lastname: string,
        activationToken: string,
    ): Promise<void> {
        const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
        const activationUrl = `${frontendUrl}/activate-account?token=${activationToken}`;

        const mailOptions = {
            from: `"${this.configService.get<string>('MAIL_FROM_NAME')}" <${this.configService.get<string>('MAIL_FROM_ADDRESS')}>`,
            to,
            subject: 'Activation de votre compte agent',
            html: this.getAgentActivationEmailTemplate(firstname, lastname, activationUrl, activationToken),
        };

        await this.transporter.sendMail(mailOptions);
        this.logger.log(`Email d'activation agent envoyé à ${to}`);
    }

    /**
     * Envoyer un email d'invitation pour rejoindre une maison de transit
     */
    async sendMaisonTransitInvitationEmail(
        to: string,
        maisonTransitName: string,
        invitedBy: string,
        invitationToken: string,
        staffRole: string,
    ): Promise<void> {
        const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
        const acceptInvitationUrl = `${frontendUrl}/maison-transit/accept-invitation?token=${invitationToken}`;

        const mailOptions = {
            from: `"${this.configService.get<string>('MAIL_FROM_NAME')}" <${this.configService.get<string>('MAIL_FROM_ADDRESS')}>`,
            to,
            subject: `Invitation à rejoindre ${maisonTransitName}`,
            html: this.getMaisonTransitInvitationEmailTemplate(
                maisonTransitName,
                invitedBy,
                staffRole,
                acceptInvitationUrl,
                invitationToken,
            ),
        };

        await this.transporter.sendMail(mailOptions);
        this.logger.log(`Email d'invitation MT envoyé à ${to}`);
    }

    /**
     * Template HTML pour l'email d'activation agent
     */
    private getAgentActivationEmailTemplate(
        firstname: string,
        lastname: string,
        activationUrl: string,
        token: string,
    ): string {
        return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Activation de votre compte</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 30px; }
        .button { display: inline-block; padding: 12px 30px; background-color: #2196F3; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        .token { background-color: #e8e8e8; padding: 10px; border-radius: 5px; font-family: monospace; word-break: break-all; margin: 15px 0; }
        .important { background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 Activation de votre compte agent</h1>
        </div>
        <div class="content">
            <h2>Bonjour ${firstname} ${lastname},</h2>
            <p>Votre compte agent a été créé sur le Système de Gestion d'Apurement des Douanes.</p>

            <div class="important">
                <strong>⚠️ Action requise :</strong> Pour activer votre compte et définir votre mot de passe personnel, veuillez cliquer sur le bouton ci-dessous.
            </div>

            <p style="text-align: center;">
                <a href="${activationUrl}" class="button">Activer mon compte et définir mon mot de passe</a>
            </p>

            <p>Ce lien d'activation est valide pendant <strong>48 heures</strong>.</p>

            <p>Si le bouton ne fonctionne pas, vous pouvez copier-coller ce lien dans votre navigateur :</p>
            <div class="token">${activationUrl}</div>

            <p style="font-size: 12px; color: #666; margin-top: 30px;">
                <strong>Note de sécurité :</strong> Pour votre sécurité, vous seul définirez votre mot de passe.
                Aucun administrateur n'a accès à votre mot de passe.
            </p>
        </div>
        <div class="footer">
            <p>Si vous n'avez pas demandé cette activation, veuillez ignorer cet email.</p>
            <p>&copy; ${new Date().getFullYear()} Système de Gestion d'Apurement. Tous droits réservés.</p>
        </div>
    </div>
</body>
</html>
        `;
    }

    /**
     * Template HTML pour l'email d'invitation maison de transit
     */
    private getMaisonTransitInvitationEmailTemplate(
        maisonTransitName: string,
        invitedBy: string,
        staffRole: string,
        acceptInvitationUrl: string,
        token: string,
    ): string {
        const roleDisplay = staffRole === 'MANAGER' ? 'Manager' : 'Staff';

        return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invitation à rejoindre ${maisonTransitName}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 30px; }
        .button { display: inline-block; padding: 12px 30px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        .info-box { background-color: #e3f2fd; padding: 15px; border-left: 4px solid #2196F3; margin: 20px 0; }
        .token { background-color: #e8e8e8; padding: 10px; border-radius: 5px; font-family: monospace; word-break: break-all; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✉️ Invitation à rejoindre une Maison de Transit</h1>
        </div>
        <div class="content">
            <h2>Bonjour,</h2>
            <p>Vous avez été invité(e) par <strong>${invitedBy}</strong> à rejoindre la maison de transit :</p>

            <div class="info-box">
                <h3 style="margin-top: 0;">📦 ${maisonTransitName}</h3>
                <p style="margin-bottom: 0;"><strong>Rôle :</strong> ${roleDisplay}</p>
            </div>

            <p>Pour accepter cette invitation et créer votre compte, cliquez sur le bouton ci-dessous :</p>

            <p style="text-align: center;">
                <a href="${acceptInvitationUrl}" class="button">Accepter l'invitation et créer mon compte</a>
            </p>

            <p>Cette invitation est valide pendant <strong>7 jours</strong>.</p>

            <p>Si le bouton ne fonctionne pas, vous pouvez copier-coller ce lien dans votre navigateur :</p>
            <div class="token">${acceptInvitationUrl}</div>

            <p style="font-size: 13px; color: #555; margin-top: 30px;">
                Lors de la création de votre compte, vous devrez :
            </p>
            <ul style="font-size: 13px; color: #555;">
                <li>Choisir un nom d'utilisateur</li>
                <li>Définir un mot de passe sécurisé</li>
                <li>Compléter vos informations personnelles</li>
            </ul>
        </div>
        <div class="footer">
            <p>Si vous n'attendiez pas cette invitation, vous pouvez ignorer cet email en toute sécurité.</p>
            <p>&copy; ${new Date().getFullYear()} Système de Gestion d'Apurement. Tous droits réservés.</p>
        </div>
    </div>
</body>
</html>
        `;
    }

    /**
     * Envoyer un email d'invitation transitaire
     */
    async sendTransitaireInvitationEmail(
        to: string,
        companyName: string,
        invitedBy: string,
        invitationToken: string,
    ): Promise<void> {
        const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
        const submitUrl = `${frontendUrl}/maison-transit/submit-request?token=${invitationToken}`;

        const mailOptions = {
            from: `"${this.configService.get<string>('MAIL_FROM_NAME')}" <${this.configService.get<string>('MAIL_FROM_ADDRESS')}>`,
            to,
            subject: 'Invitation à créer votre maison de transit',
            html: this.getTransitaireInvitationTemplate(companyName, invitedBy, submitUrl),
        };

        await this.transporter.sendMail(mailOptions);
        this.logger.log(`Email d'invitation transitaire envoyé à ${to}`);
    }

    /**
     * Envoyer une notification de soumission de demande
     */
    async sendRequestSubmittedNotificationEmail(
        to: string,
        companyName: string,
    ): Promise<void> {
        const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
        const reviewUrl = `${frontendUrl}/admin/maison-transit-requests`;

        const mailOptions = {
            from: `"${this.configService.get<string>('MAIL_FROM_NAME')}" <${this.configService.get<string>('MAIL_FROM_ADDRESS')}>`,
            to,
            subject: `Nouvelle demande de maison de transit - ${companyName}`,
            html: this.getRequestSubmittedNotificationTemplate(companyName, reviewUrl),
        };

        await this.transporter.sendMail(mailOptions);
        this.logger.log(`Notification de soumission envoyée à ${to}`);
    }

    /**
     * Envoyer un email d'approbation de demande
     */
    async sendRequestApprovedEmail(
        to: string,
        companyName: string,
        activationToken: string,
    ): Promise<void> {
        const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
        const activateUrl = `${frontendUrl}/maison-transit/activate?token=${activationToken}`;

        const mailOptions = {
            from: `"${this.configService.get<string>('MAIL_FROM_NAME')}" <${this.configService.get<string>('MAIL_FROM_ADDRESS')}>`,
            to,
            subject: `Demande approuvée - ${companyName}`,
            html: this.getRequestApprovedTemplate(companyName, activateUrl),
        };

        await this.transporter.sendMail(mailOptions);
        this.logger.log(`Email d'approbation envoyé à ${to}`);
    }

    /**
     * Envoyer un email de rejet de demande
     */
    async sendRequestRejectedEmail(
        to: string,
        companyName: string,
        rejectionReason: string,
    ): Promise<void> {
        const mailOptions = {
            from: `"${this.configService.get<string>('MAIL_FROM_NAME')}" <${this.configService.get<string>('MAIL_FROM_ADDRESS')}>`,
            to,
            subject: `Demande rejetée - ${companyName}`,
            html: this.getRequestRejectedTemplate(companyName, rejectionReason),
        };

        await this.transporter.sendMail(mailOptions);
        this.logger.log(`Email de rejet envoyé à ${to}`);
    }

    /**
     * Template HTML pour l'invitation transitaire
     */
    private getTransitaireInvitationTemplate(
        companyName: string,
        invitedBy: string,
        submitUrl: string,
    ): string {
        return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invitation à créer votre maison de transit</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 30px; }
        .button { display: inline-block; padding: 12px 30px; background-color: #2196F3; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        .info-box { background-color: #e3f2fd; padding: 15px; border-left: 4px solid #2196F3; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Invitation à créer votre Maison de Transit</h1>
        </div>
        <div class="content">
            <h2>Bonjour,</h2>
            <p>Vous avez été invité(e) par <strong>${invitedBy}</strong> à enregistrer votre maison de transit sur le Système de Gestion d'Apurement des Douanes.</p>

            <div class="info-box">
                <h3 style="margin-top: 0;">${companyName}</h3>
            </div>

            <p>Pour soumettre votre demande, vous devrez fournir les documents suivants :</p>
            <ul>
                <li>Registre de Commerce (RC)</li>
                <li>NINEA</li>
                <li>Carte professionnelle (optionnel)</li>
            </ul>

            <p style="text-align: center;">
                <a href="${submitUrl}" class="button">Soumettre ma demande</a>
            </p>

            <p><strong>Cette invitation est valide pendant 30 jours.</strong></p>

            <p style="font-size: 13px; color: #555; margin-top: 30px;">
                <strong>Processus de validation :</strong><br>
                1. Soumission de votre demande avec documents<br>
                2. Vérification par les services de la Douane<br>
                3. Activation de votre compte une fois approuvé
            </p>
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
     * Template HTML pour la notification de soumission
     */
    private getRequestSubmittedNotificationTemplate(
        companyName: string,
        reviewUrl: string,
    ): string {
        return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nouvelle demande à valider</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #FF9800; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 30px; }
        .button { display: inline-block; padding: 12px 30px; background-color: #FF9800; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Nouvelle demande de Maison de Transit</h1>
        </div>
        <div class="content">
            <h2>Une nouvelle demande nécessite votre attention</h2>
            <p>La société <strong>${companyName}</strong> a soumis sa demande de création de maison de transit.</p>

            <p>Veuillez examiner les documents fournis et approuver ou rejeter la demande.</p>

            <p style="text-align: center;">
                <a href="${reviewUrl}" class="button">Consulter la demande</a>
            </p>
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
     * Template HTML pour l'approbation
     */
    private getRequestApprovedTemplate(
        companyName: string,
        activateUrl: string,
    ): string {
        return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demande approuvée</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 30px; }
        .button { display: inline-block; padding: 12px 30px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        .success-box { background-color: #d4edda; padding: 15px; border-left: 4px solid #4CAF50; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Félicitations ! Demande approuvée</h1>
        </div>
        <div class="content">
            <div class="success-box">
                <h3 style="margin-top: 0; color: #155724;">Votre demande a été approuvée</h3>
                <p style="margin-bottom: 0; color: #155724;">La société <strong>${companyName}</strong> peut maintenant activer son compte.</p>
            </div>

            <p>Pour finaliser votre inscription et accéder au système, veuillez créer votre compte en cliquant sur le bouton ci-dessous :</p>

            <p style="text-align: center;">
                <a href="${activateUrl}" class="button">Activer mon compte</a>
            </p>

            <p>Lors de l'activation, vous devrez :</p>
            <ul>
                <li>Choisir un nom d'utilisateur</li>
                <li>Définir un mot de passe sécurisé</li>
                <li>Compléter vos informations personnelles</li>
            </ul>
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
     * Template HTML pour le rejet
     */
    private getRequestRejectedTemplate(
        companyName: string,
        rejectionReason: string,
    ): string {
        return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demande rejetée</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f44336; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 30px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        .error-box { background-color: #f8d7da; padding: 15px; border-left: 4px solid #f44336; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Demande non approuvée</h1>
        </div>
        <div class="content">
            <h2>Bonjour,</h2>
            <p>Nous avons examiné la demande de création de maison de transit pour <strong>${companyName}</strong>.</p>

            <div class="error-box">
                <h3 style="margin-top: 0; color: #721c24;">Raison du rejet :</h3>
                <p style="margin-bottom: 0; color: #721c24;">${rejectionReason}</p>
            </div>

            <p>Si vous pensez qu'il s'agit d'une erreur ou si vous souhaitez corriger les informations, veuillez contacter les services de la Douane.</p>
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
