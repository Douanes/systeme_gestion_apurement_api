import { Module } from '@nestjs/common';
import { SystemParameterController } from './system-parameter.controller';
import { SystemParameterService } from './system-parameter.service';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [SystemParameterController],
    providers: [SystemParameterService],
    exports: [SystemParameterService],
})
export class SystemParameterModule {}
