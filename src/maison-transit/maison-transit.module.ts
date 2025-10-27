import { Module } from '@nestjs/common';
import { MaisonTransitController } from './maison-transit.controller';
import { MaisonTransitService } from './maison-transit.service';

@Module({
  controllers: [MaisonTransitController],
  providers: [MaisonTransitService]
})
export class MaisonTransitModule {}
