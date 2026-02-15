import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
    private readonly logger = new Logger(CloudinaryService.name);

    constructor(private readonly configService: ConfigService) {
        cloudinary.config({
            cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
        });
    }

    /**
     * Générer une signature pour l'upload direct depuis le client
     * Cette méthode sécurise l'upload en signant les paramètres côté serveur
     *
     * IMPORTANT: Pour les uploads en mode 'authenticated' (privé), le paramètre 'type'
     * DOIT être inclus dans la signature. Le paramètre 'resource_type' n'est PAS signé
     * mais doit être envoyé par le frontend dans le FormData.
     */
    generateSignature(params: {
        folder?: string;
        public_id?: string;
        timestamp?: number;
        upload_preset?: string;
        type?: string;
    }): {
        signature: string;
        timestamp: number;
        api_key: string;
        cloud_name: string;
    } {
        const timestamp = params.timestamp || Math.round(new Date().getTime() / 1000);

        // Paramètres à signer (sans api_key et cloud_name)
        const paramsToSign: any = {
            timestamp,
        };

        if (params.folder) {
            paramsToSign.folder = params.folder;
        }

        if (params.public_id) {
            paramsToSign.public_id = params.public_id;
        }

        if (params.upload_preset) {
            paramsToSign.upload_preset = params.upload_preset;
        }

        if (params.type) {
            paramsToSign.type = params.type;
        }

        // NOTE: resource_type n'est PAS signé mais le frontend doit l'envoyer dans le FormData

        // Générer la signature
        const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');
        if (!apiSecret) {
            throw new Error('CLOUDINARY_API_SECRET is not configured');
        }

        const signature = cloudinary.utils.api_sign_request(
            paramsToSign,
            apiSecret,
        );

        this.logger.log('Signature Cloudinary générée pour upload direct');

        const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
        const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');

        if (!apiKey || !cloudName) {
            throw new Error('Cloudinary credentials are not fully configured');
        }

        return {
            signature,
            timestamp,
            api_key: apiKey,
            cloud_name: cloudName,
        };
    }

    /**
     * Supprimer un fichier de Cloudinary
     * Utilisé quand une demande est rejetée ou des documents doivent être supprimés
     */
    async deleteFile(publicId: string): Promise<void> {
        try {
            const result = await cloudinary.uploader.destroy(publicId);
            this.logger.log(`Fichier supprimé de Cloudinary: ${publicId}, résultat: ${result.result}`);
        } catch (error) {
            this.logger.error(`Erreur lors de la suppression du fichier ${publicId}: ${error.message}`);
            throw error;
        }
    }

    /**
     * Supprimer plusieurs fichiers
     */
    async deleteFiles(publicIds: string[]): Promise<void> {
        try {
            for (const publicId of publicIds) {
                await this.deleteFile(publicId);
            }
        } catch (error) {
            this.logger.error(`Erreur lors de la suppression de fichiers multiples: ${error.message}`);
            throw error;
        }
    }

    /**
     * Obtenir les informations d'un fichier uploadé
     */
    async getFileInfo(publicId: string): Promise<any> {
        try {
            const result = await cloudinary.api.resource(publicId);
            return result;
        } catch (error) {
            this.logger.error(`Erreur lors de la récupération des infos du fichier ${publicId}: ${error.message}`);
            throw error;
        }
    }

    /**
     * Récupérer le dossier Cloudinary depuis la configuration
     */
    getFolder(): string {
        return this.configService.get<string>('CLOUDINARY_FOLDER', 'maison-transit-documents');
    }

    /**
     * Générer une URL signée pour accéder à un fichier privé
     *
     * NOTE: Contrairement à AWS S3, les URLs signées Cloudinary 'authenticated'
     * n'expirent pas automatiquement. La sécurité vient du fait que seul le serveur
     * avec l'API_SECRET peut générer ces URLs. Pour révoquer l'accès, il faut
     * supprimer le fichier ou le déplacer vers un autre public_id.
     *
     * @param publicId - Le public_id du fichier dans Cloudinary (avec ou sans extension)
     * @returns URL signée pour accéder au fichier
     */
    generateSignedUrl(publicId: string): string {
        const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');

        if (!cloudName) {
            throw new Error('CLOUDINARY_CLOUD_NAME is not configured');
        }

        // Détecter l'extension du fichier
        const extensionMatch = publicId.match(/\.([a-zA-Z0-9]+)$/);
        const extension = extensionMatch ? extensionMatch[1].toLowerCase() : null;

        // Enlever l'extension du public_id (Cloudinary la gère via le paramètre format)
        const cleanPublicId = extension
            ? publicId.replace(/\.[a-zA-Z0-9]+$/, '')
            : publicId;

        this.logger.log(`Génération URL signée pour: ${cleanPublicId} (extension: ${extension || 'aucune'})`);

        // Déterminer les paramètres selon le type de fichier
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'];
        const isImage = extension && imageExtensions.includes(extension);

        const originalAnalytics = (cloudinary.config() as any).analytics;
        (cloudinary.config() as any).analytics = false;

        try {
            const urlOptions: any = {
                sign_url: true,
                type: 'authenticated',
                resource_type: 'raw',
                secure: true,
            };

            // Ajouter le format seulement si on a une extension
            if (extension) {
                urlOptions.format = extension;
            }

            // Pour les fichiers non-image, forcer le téléchargement
            // Pour les images, permettre l'affichage inline
            if (!isImage) {
                urlOptions.flags = 'attachment';
            }

            const signedUrl = cloudinary.url(cleanPublicId, urlOptions);

            this.logger.log(`URL signée générée: ${signedUrl}`);
            return signedUrl;
        } finally {
            (cloudinary.config() as any).analytics = originalAnalytics;
        }
    }
}
