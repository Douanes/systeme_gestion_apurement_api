import { Module } from '@nestjs/common';
import { EscouadeService } from './escouade.service';
import { EscouadeController } from './escouade.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EscouadeController],
  providers: [EscouadeService],
})
export class EscouadeModule {}
