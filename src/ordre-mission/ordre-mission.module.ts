import { Module } from '@nestjs/common';
import { OrdreMissionService } from './ordre-mission.service';
import { OrdreMissionController } from './ordre-mission.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OrdreMissionController],
  providers: [OrdreMissionService],
})
export class OrdreMissionModule {}
