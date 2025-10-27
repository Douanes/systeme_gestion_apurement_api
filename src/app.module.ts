import { Module } from '@nestjs/common';
import { DeclarationModule } from './declaration/declaration.module';
import { PrismaService } from 'prisma/prisma.service';
import { RegimeModule } from './regime/regime.module';
import { MaisonTransitModule } from './maison-transit/maison-transit.module';
import { BureauSortieModule } from './bureau-sortie/bureau-sortie.module';
import { AgentModule } from './agent/agent.module';
import { EscouadeModule } from './escouade/escouade.module';
import { OrdreMissionModule } from './ordre-mission/ordre-mission.module';

@Module({
  imports: [
    DeclarationModule,
    RegimeModule,
    MaisonTransitModule,
    BureauSortieModule,
    AgentModule,
    EscouadeModule,
    OrdreMissionModule,
  ],
  providers: [
    PrismaService
  ],
})
export class AppModule {}
