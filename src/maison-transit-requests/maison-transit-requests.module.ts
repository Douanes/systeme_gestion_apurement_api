import { Module } from '@nestjs/common';
import { MaisonTransitRequestsService } from './maison-transit-requests.service';
import { MaisonTransitRequestsController } from './maison-transit-requests.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { MailModule } from '../mail/mail.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
    imports: [PrismaModule, MailModule, CloudinaryModule, PermissionsModule],
    controllers: [MaisonTransitRequestsController],
    providers: [MaisonTransitRequestsService],
    exports: [MaisonTransitRequestsService],
})
export class MaisonTransitRequestsModule {}
