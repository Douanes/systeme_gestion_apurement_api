import { Module } from '@nestjs/common';
import { OrdreMissionController } from './ordre.controller';
import { OrdreMissionService } from './ordre.service';
import { ModificationRequestController } from './modification-request.controller';
import { ModificationRequestListController } from './modification-request-list.controller';
import { ModificationRequestService } from './modification-request.service';
import { PrismaModule } from 'prisma/prisma.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
    imports: [PrismaModule, CloudinaryModule, NotificationModule],
    controllers: [OrdreMissionController, ModificationRequestListController, ModificationRequestController],
    providers: [OrdreMissionService, ModificationRequestService],
    exports: [OrdreMissionService, ModificationRequestService],
})
export class OrdreMissionModule { }