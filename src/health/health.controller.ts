import { Controller, Get } from '@nestjs/common';
import {
    HealthCheck,
    HealthCheckService,
    HealthCheckResult,
    PrismaHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from 'prisma/prisma.service';

@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private prismaHealth: PrismaHealthIndicator,
        private prisma: PrismaService,
    ) { }

    @Get()
    @HealthCheck()
    async check(): Promise<HealthCheckResult> {
        return this.health.check([
            // Check Supabase connection
            () => this.prismaHealth.pingCheck('supabase', this.prisma),
        ]);
    }
}