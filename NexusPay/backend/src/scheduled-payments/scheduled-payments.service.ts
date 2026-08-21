import { Injectable, NotFoundException } from '@nestjs/common';
import { JsonStore } from '../common/json-store';
import { CreateScheduledPaymentDto } from './dto/create-scheduled-payment.dto';
import { UpdateScheduledPaymentDto } from './dto/update-scheduled-payment.dto';

export interface ScheduledPaymentRecord {
  id: string;
  userId: string;
  title: string;
  receiverId: string;
  amount: number;
  frequency: string;
  nextPayment: string;
  status: string;
  type: string;
}

const SEED: ScheduledPaymentRecord[] = [
  { id: 'sp1', userId: 'john.c@nexuspay', title: 'Rent Payment', receiverId: 'amazon.m@nexuspay', amount: 15000, frequency: 'monthly', nextPayment: '2026-04-01', status: 'active', type: 'outgoing' },
  { id: 'sp2', userId: 'john.c@nexuspay', title: 'Electricity Bill', receiverId: 'swiggy.m@nexuspay', amount: 2400, frequency: 'monthly', nextPayment: '2026-04-05', status: 'active', type: 'outgoing' },
  { id: 'sp3', userId: 'john.c@nexuspay', title: 'Netflix Subscription', receiverId: 'flipkart.m@nexuspay', amount: 649, frequency: 'monthly', nextPayment: '2026-04-07', status: 'active', type: 'outgoing' },
];

@Injectable()
export class ScheduledPaymentsService {
  private store = new JsonStore<ScheduledPaymentRecord>('scheduled-payments.json', SEED);

  findByUser(userId: string): ScheduledPaymentRecord[] {
    return this.store.readAll().filter(s => s.userId === userId);
  }

  findAll(): ScheduledPaymentRecord[] { return this.store.readAll(); }

  findOne(id: string): ScheduledPaymentRecord {
    const data = this.store.readAll();
    const s = data.find(x => x.id === id);
    if (!s) throw new NotFoundException(`Schedule ${id} not found`);
    return s;
  }

  create(dto: CreateScheduledPaymentDto): ScheduledPaymentRecord {
    const data = this.store.readAll();
    const s: ScheduledPaymentRecord = {
      id: this.store.getNextId('sp', 'id', 1),
      userId: dto.userId ?? 'john.c@nexuspay',
      title: dto.title,
      receiverId: dto.receiverId,
      amount: dto.amount,
      frequency: dto.frequency,
      nextPayment: dto.nextPayment,
      status: 'active',
      type: 'outgoing',
    };
    data.push(s);
    this.store.writeAll(data);
    return s;
  }

  update(id: string, dto: UpdateScheduledPaymentDto): ScheduledPaymentRecord {
    const data = this.store.readAll();
    const s = data.find(x => x.id === id);
    if (!s) throw new NotFoundException(`Schedule ${id} not found`);
    Object.assign(s, dto);
    this.store.writeAll(data);
    return s;
  }

  remove(id: string): void {
    const data = this.store.readAll();
    const idx = data.findIndex(s => s.id === id);
    if (idx === -1) throw new NotFoundException(`Schedule ${id} not found`);
    data.splice(idx, 1);
    this.store.writeAll(data);
  }
}
