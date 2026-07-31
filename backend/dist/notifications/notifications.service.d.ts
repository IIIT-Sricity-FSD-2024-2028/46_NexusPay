export interface NotificationRecord {
    id: string;
    userId: string;
    message: string;
    type: string;
    read: boolean;
    date: string;
}
export interface CreateNotificationDto {
    userId: string;
    message: string;
    type: string;
}
export declare class NotificationsService {
    private store;
    findByUser(userId: string): NotificationRecord[];
    findAll(): NotificationRecord[];
    create(data: CreateNotificationDto): NotificationRecord;
    markRead(id: string): NotificationRecord;
    markAllRead(userId: string): void;
    clearAll(userId: string): void;
    getUnreadCount(userId: string): number;
}
