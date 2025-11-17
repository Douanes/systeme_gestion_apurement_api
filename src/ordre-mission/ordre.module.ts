import { Module } from '@nestjs/common';
import { OrdreMissionController } from './ordre.controller';
import { OrdreMissionService } from './ordre.service';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [OrdreMissionController],
    providers: [OrdreMissionService],
    exports: [OrdreMissionService],
})
export class OrdreMissionModule { }