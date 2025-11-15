import { Module } from '@nestjs/common';
import { EscouadeController } from './escouade.controller';
import { EscouadeService } from './escouade.service';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [EscouadeController],
    providers: [EscouadeService],
    exports: [EscouadeService],
})
export class EscouadeModule { }