import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Subject } from 'rxjs';
import { TypeNotification } from '@prisma/client';

@Injectable()
export class NotificationService {
    // Stream pour les notifications SSE
    private notificationStream = new Subject<any>();

    constructor(private readonly prisma: PrismaService) {}

    /**
     * Créer une notification et l'émettre via SSE
     */
    async createNotification(data: {
        userId: number;
        title: string;
        message: string;
        type?: TypeNotification;
        relatedId?: number;
    }) {
        const notification = await (this.prisma as any).notification.create({
            data: {
                userId: data.userId,
                title: data.title,
                message: data.message,
                type: data.type || 'INFO',
                relatedId: data.relatedId,
            },
        });

        // Émettre la notification pour le flux SSE
        this.notificationStream.next({
            userId: data.userId,
            data: notification,
        });

        return notification;
    }

    /**
     * S'abonner au flux de notifications
     */
    getNotificationStream() {
        return this.notificationStream.asObservable();
    }

    /**
     * Marquer comme lu
     */
    async markAsRead(id: number) {
        return (this.prisma as any).notification.update({
            where: { id },
            data: { isRead: true },
        });
    }

    /**
     * Récupérer les notifications d'un utilisateur
     */
    async getUserNotifications(userId: number, limit = 20) {
        return (this.prisma as any).notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }
}
