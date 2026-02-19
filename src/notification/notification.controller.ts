import {
    Controller,
    Get,
    Sse,
    UseGuards,
    Req,
    Param,
    Patch,
    ParseIntPipe,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Observable, filter, map } from 'rxjs';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Notifications')
@ApiBearerAuth('JWT-auth')
@Controller('notifications')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @UseGuards(JwtAuthGuard)
    @Sse('sse')
    @ApiOperation({ summary: 'Flux de notifications en temps réel (SSE)' })
    streamNotifications(@Req() req): Observable<any> {
        const userId = req.user.id;
        return this.notificationService.getNotificationStream().pipe(
            filter((n) => n.userId === userId),
            map((n) => ({ data: n.data })), // Format requis par SSE
        );
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({ summary: 'Récupérer mes notifications' })
    async getMyNotifications(@Req() req) {
        return this.notificationService.getUserNotifications(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/read')
    @ApiOperation({ summary: 'Marquer une notification comme lue' })
    async markAsRead(@Param('id', ParseIntPipe) id: number) {
        return this.notificationService.markAsRead(id);
    }
}
