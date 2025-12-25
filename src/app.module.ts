import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RegimeModule } from './regime/regime.module';
import { PrismaModule } from 'prisma/prisma.module';
import { BureauSortieModule } from './bureau-sortie/office.module';
import { MaisonTransitModule } from './maison-transit/transit.module';
import { EscouadeModule } from './escouade/escouade.module';
import { AgentModule } from './agent/agent.module';
import { OrdreMissionModule } from './ordre-mission/ordre.module';
import { StatisticsModule } from './statistique/statistics.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { UsersModule } from './users/users.module';
import { PermissionsModule } from './permissions/permissions.module';
import { ProfileService } from './profile/profile.service';
import { ProfileController } from './profile/profile.controller';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MaisonTransitRequestsModule } from './maison-transit-requests/maison-transit-requests.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    MailModule,
    UsersModule,
    PermissionsModule,
    CloudinaryModule,
    MaisonTransitRequestsModule,
    RegimeModule,
    BureauSortieModule,
    MaisonTransitModule,
    EscouadeModule,
    AgentModule,
    OrdreMissionModule,
    StatisticsModule
  ],
  providers: [ProfileService],
  controllers: [ProfileController],
})
export class AppModule { }
