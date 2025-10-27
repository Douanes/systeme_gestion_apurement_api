import { Module } from '@nestjs/common';
import { RegimeController } from './regime.controller';
import { RegimeService } from './regime.service';

@Module({
  controllers: [RegimeController],
  providers: [RegimeService]
})
export class RegimeModule {}
