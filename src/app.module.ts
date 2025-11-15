import { Module } from '@nestjs/common';
import { RegimeModule } from './regime/regime.module';
import { PrismaModule } from 'prisma/prisma.module';
import { BureauSortieModule } from './bureau-sortie/office.module';
import { MaisonTransitModule } from './maison-transit/transit.module';

@Module({
  imports: [
    PrismaModule,
    RegimeModule,
    BureauSortieModule,
    MaisonTransitModule
  ],
  providers: [],
})
export class AppModule { }
