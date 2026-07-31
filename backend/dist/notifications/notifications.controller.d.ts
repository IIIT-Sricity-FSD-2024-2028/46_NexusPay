import { NotificationsService } from './notifications.service';
import type { NotificationRecord, CreateNotificationDto } from './notifications.service';
export declare class NotificationsController {
    private service;
    constructor(service: NotificationsService);
    findAll(userId?: string): NotificationRecord[];
    getUnread(userId: string): {
        count: number;
    };
    create(body: CreateNotificationDto): NotificationRecord;
    markRead(id: string): NotificationRecord;
    markAllRead(userId: string): {
        message: string;
    };
    clearAll(userId: string): {
        message: string;
    };
}
