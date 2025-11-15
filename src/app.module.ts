import { Module } from '@nestjs/common';
import { RegimeModule } from './regime/regime.module';
import { PrismaModule } from 'prisma/prisma.module';
import { BureauSortieModule } from './bureau-sortie/office.module';

@Module({
  imports: [
    PrismaModule,
    RegimeModule,
    BureauSortieModule
  ],
  providers: [],
})
export class AppModule { }
