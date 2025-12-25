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
     */
    generateSignature(params: {
        folder?: string;
        public_id?: string;
        timestamp?: number;
        upload_preset?: string;
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
}
