import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RegimeModule } from './regime/regime.module';
import { PrismaModule } from 'prisma/prisma.module';
import { BureauSortieModule } from './bureau-sortie/office.module';
import { MaisonTransitModule } from './maison-transit/transit.module';
import { EscouadeModule } from './escouade/escouade.module';
import { AgentModule } from './agent/agent.module';
import { OrdreMissionModule } from './ordre-mission/ordre.module';
import { StatisticsModule } from './statistique/statistics.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    MailModule,
    UsersModule,
    RegimeModule,
    BureauSortieModule,
    MaisonTransitModule,
    EscouadeModule,
    AgentModule,
    OrdreMissionModule,
    StatisticsModule
  ],
  providers: [],
})
export class AppModule { }
