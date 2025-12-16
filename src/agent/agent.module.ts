import { Module } from '@nestjs/common';
import { AgentController } from './agent.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { AgentService } from './agent.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [PrismaModule, ConfigModule],
    controllers: [AgentController],
    providers: [AgentService],
    exports: [AgentService],
})
export class AgentModule { }