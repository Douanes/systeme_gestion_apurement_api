import { Module } from '@nestjs/common';
import { OrdreMissionController } from './ordre.controller';
import { OrdreMissionService } from './ordre.service';
import { PrismaModule } from 'prisma/prisma.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
    imports: [PrismaModule, CloudinaryModule],
    controllers: [OrdreMissionController],
    providers: [OrdreMissionService],
    exports: [OrdreMissionService],
})
export class OrdreMissionModule { }