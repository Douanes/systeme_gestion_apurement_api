import { Module } from '@nestjs/common';
import { MaisonTransitController } from './transit.controller';
import { MaisonTransitService } from './transit.service';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [MaisonTransitController],
    providers: [MaisonTransitService],
    exports: [MaisonTransitService],
})
export class MaisonTransitModule { }