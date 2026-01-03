import { Module } from '@nestjs/common';
import { DepositaireController } from './depositaire.controller';
import { DepositaireService } from './depositaire.service';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [DepositaireController],
    providers: [DepositaireService],
    exports: [DepositaireService],
})
export class DepositaireModule {}
