import { Module } from '@nestjs/common';
import { BureauSortieService } from './bureau-sortie.service';
import { BureauSortieController } from './bureau-sortie.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BureauSortieController],
  providers: [BureauSortieService],
})
export class BureauSortieModule {}
