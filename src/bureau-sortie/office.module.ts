import { Module } from '@nestjs/common';
import { BureauSortieService } from './office.service';
import { PrismaModule } from 'prisma/prisma.module';
import { BureauSortieController } from './office.controller';

@Module({
    imports: [PrismaModule],
    controllers: [BureauSortieController],
    providers: [BureauSortieService],
    exports: [BureauSortieService],
})
export class BureauSortieModule { }