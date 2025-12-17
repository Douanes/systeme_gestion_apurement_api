import { Module } from '@nestjs/common';
import { AgentController } from './agent.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { AgentService } from './agent.service';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from '../mail/mail.module';

@Module({
    imports: [PrismaModule, ConfigModule, MailModule],
    controllers: [AgentController],
    providers: [AgentService],
    exports: [AgentService],
})
export class AgentModule { }