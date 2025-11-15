import { Module } from '@nestjs/common';
import { RegimeModule } from './regime/regime.module';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    RegimeModule,
  ],
  providers: [],
})
export class AppModule { }
