import { Injectable, NotFoundException } from '@nestjs/common';
import { JsonStore } from '../common/json-store';

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

const SEED: NotificationRecord[] = [
  { id: 'n1', userId: 'john.c@nexuspay', message: 'Payment of ₹5,000 sent to alice.c@nexuspay', type: 'payment', read: false, date: '2 min ago' },
  { id: 'n2', userId: 'john.c@nexuspay', message: 'Received ₹2,500 from bob.c@nexuspay', type: 'received', read: false, date: '15 min ago' },
  { id: 'n3', userId: 'john.c@nexuspay', message: 'New split request from emma.c@nexuspay', type: 'split', read: false, date: '1 hour ago' },
  { id: 'n4', userId: 'john.c@nexuspay', message: 'Your scheduled payment of ₹15,000 for Rent is due tomorrow', type: 'reminder', read: true, date: '3 hours ago' },
  { id: 'n5', userId: 'john.c@nexuspay', message: 'Dispute DSP001 status updated to In Review', type: 'dispute', read: true, date: '1 day ago' },
];

@Injectable()
export class NotificationsService {
  private store = new JsonStore<NotificationRecord>('notifications.json', SEED);

  findByUser(userId: string): NotificationRecord[] {
    return this.store.readAll().filter(n => n.userId === userId);
  }

  findAll(): NotificationRecord[] { return this.store.readAll(); }

  create(data: CreateNotificationDto): NotificationRecord {
    const all = this.store.readAll();
    const n: NotificationRecord = {
      id: this.store.getNextId('n', 'id', 1),
      userId: data.userId,
      message: data.message,
      type: data.type,
      read: false,
      date: new Date().toISOString(),
    };
    all.unshift(n);
    this.store.writeAll(all);
    return n;
  }

  markRead(id: string): NotificationRecord {
    const data = this.store.readAll();
    const n = data.find(x => x.id === id);
    if (!n) throw new NotFoundException(`Notification ${id} not found`);
    n.read = true;
    this.store.writeAll(data);
    return n;
  }

  markAllRead(userId: string): void {
    const data = this.store.readAll();
    data.filter(n => n.userId === userId).forEach(n => { n.read = true; });
    this.store.writeAll(data);
  }

  clearAll(userId: string): void {
    const filtered = this.store.readAll().filter(n => n.userId !== userId);
    this.store.writeAll(filtered);
  }

  getUnreadCount(userId: string): number {
    return this.store.readAll().filter(n => n.userId === userId && !n.read).length;
  }
}
