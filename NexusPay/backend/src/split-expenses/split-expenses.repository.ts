import { Injectable } from '@nestjs/common';
import { JsonStore } from '../common/json-store';

export interface SplitMember {
  memberId: string;
  share: number;
  paid: boolean;
}

export interface SplitRecord {
  id: string;
  name: string;
  createdBy: string;
  members: SplitMember[];
  totalAmount: number;
  settled: number;
  date: string;
  status: string;
  description: string;
}

const SEED: SplitRecord[] = [
  {
    id: 'split1', name: 'Weekend Dinner', createdBy: 'john.c@nexuspay',
    members: [
      { memberId: 'alice.c@nexuspay', share: 500, paid: true },
      { memberId: 'bob.c@nexuspay', share: 500, paid: false },
      { memberId: 'emma.c@nexuspay', share: 500, paid: true },
      { memberId: 'david.c@nexuspay', share: 500, paid: false },
    ],
    totalAmount: 2000, settled: 1000, date: '2026-03-15', status: 'pending', description: 'Dinner at Taj restaurant',
  },
  {
    id: 'split2', name: 'Road Trip', createdBy: 'john.c@nexuspay',
    members: [
      { memberId: 'sarah.c@nexuspay', share: 2500, paid: true },
      { memberId: 'tom.c@nexuspay', share: 2500, paid: true },
      { memberId: 'priya.c@nexuspay', share: 2500, paid: false },
    ],
    totalAmount: 7500, settled: 5000, date: '2026-03-10', status: 'pending', description: 'Fuel + snacks',
  },
  {
    id: 'split3', name: 'OTT Subscriptions', createdBy: 'john.c@nexuspay',
    members: [
      { memberId: 'raj.c@nexuspay', share: 200, paid: true },
      { memberId: 'bob.c@nexuspay', share: 200, paid: true },
    ],
    totalAmount: 400, settled: 400, date: '2026-02-28', status: 'completed', description: 'Netflix + Spotify shared',
  },
];

@Injectable()
export class SplitExpensesRepository {
  private store = new JsonStore<SplitRecord>('split-expenses.json', SEED);

  findAll(): SplitRecord[] { return this.store.readAll(); }

  findByUserId(userId: string): SplitRecord[] {
    return this.store.readAll().filter(
      s => s.createdBy === userId || s.members.some(m => m.memberId === userId),
    );
  }

  findById(id: string): SplitRecord | undefined { return this.store.readAll().find(s => s.id === id); }
  nextId(): string { return this.store.getNextId('split', 'id', 1); }

  save(split: SplitRecord): SplitRecord {
    const data = this.store.readAll();
    data.unshift(split);
    this.store.writeAll(data);
    return split;
  }

  update(id: string, partial: Partial<SplitRecord>): SplitRecord | undefined {
    const data = this.store.readAll();
    const record = data.find(s => s.id === id);
    if (!record) return undefined;
    Object.assign(record, partial);
    this.store.writeAll(data);
    return record;
  }

  deleteById(id: string): boolean {
    const data = this.store.readAll();
    const idx = data.findIndex(s => s.id === id);
    if (idx === -1) return false;
    data.splice(idx, 1);
    this.store.writeAll(data);
    return true;
  }
}
