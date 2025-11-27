import { Module } from '@nestjs/common';
import { RegimeModule } from './regime/regime.module';
import { PrismaModule } from 'prisma/prisma.module';
import { BureauSortieModule } from './bureau-sortie/office.module';
import { MaisonTransitModule } from './maison-transit/transit.module';
import { EscouadeModule } from './escouade/escouade.module';
import { AgentModule } from './agent/agent.module';
import { OrdreMissionModule } from './ordre-mission/ordre.module';
import { StatisticsModule } from './statistique/statistics.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    PrismaModule,
    HealthModule,
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
