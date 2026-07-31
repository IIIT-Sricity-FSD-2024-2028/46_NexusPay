import { Injectable, NotFoundException } from '@nestjs/common';
import { JsonStore } from '../common/json-store';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { UpdateDisputeDto } from './dto/update-dispute.dto';

export interface DisputeRecord {
  id: string;
  txnId: string;
  customerId: string;
  amount: number;
  reason: string;
  status: string;
  date: string;
  raisedBy: string;
  assignedTo: string;
  description?: string;
}

export interface DisputeCounts {
  total: number;
  pending: number;
  review: number;
  solved: number;
}

const SEED: DisputeRecord[] = [
  { id: 'DSP001', txnId: 'TXN005', customerId: 'sarah.c@nexuspay', amount: 450, reason: 'Settlement amount delayed', status: 'Pending', date: '2024-03-28', raisedBy: 'sarah.c@nexuspay', assignedTo: 'admin.a@nexuspay' },
  { id: 'DSP002', txnId: 'TXN013', customerId: 'tom.c@nexuspay', amount: 520, reason: 'Wrong settlement amount received', status: 'Pending', date: '2024-03-27', raisedBy: 'tom.c@nexuspay', assignedTo: 'admin.a@nexuspay' },
  { id: 'DSP003', txnId: 'TXN009', customerId: 'alice.c@nexuspay', amount: 8900, reason: 'Settlement amount delayed', status: 'In Review', date: '2024-03-26', raisedBy: 'alice.c@nexuspay', assignedTo: 'admin.a@nexuspay' },
  { id: 'DSP004', txnId: 'TXN017', customerId: 'emma.c@nexuspay', amount: 500, reason: 'Duplicate charge', status: 'In Review', date: '2024-03-25', raisedBy: 'emma.c@nexuspay', assignedTo: 'admin.a@nexuspay' },
  { id: 'DSP005', txnId: 'TXN004', customerId: 'john.c@nexuspay', amount: 800, reason: 'Duplicate charge', status: 'Solved', date: '2024-03-24', raisedBy: 'john.c@nexuspay', assignedTo: 'admin.a@nexuspay' },
  { id: 'DSP006', txnId: 'TXN010', customerId: 'bob.c@nexuspay', amount: 1200, reason: 'Wrong settlement amount received', status: 'Solved', date: '2024-03-22', raisedBy: 'bob.c@nexuspay', assignedTo: 'admin.a@nexuspay' },
];

@Injectable()
export class DisputesService {
  private store = new JsonStore<DisputeRecord>('disputes.json', SEED);

  findAll(status?: string): DisputeRecord[] {
    const data = this.store.readAll();
    if (status && status !== 'all') return data.filter(d => d.status === status);
    return data;
  }

  findOne(id: string): DisputeRecord {
    const data = this.store.readAll();
    const d = data.find(x => x.id === id);
    if (!d) throw new NotFoundException(`Dispute ${id} not found`);
    return d;
  }

  findByCustomer(customerId: string): DisputeRecord[] {
    return this.store.readAll().filter(d => d.customerId.toLowerCase().includes(customerId.toLowerCase()));
  }

  findByRaisedBy(userId: string): DisputeRecord[] {
    return this.store.readAll().filter(d => d.raisedBy === userId);
  }

  findByAssignedTo(adminId: string): DisputeRecord[] {
    return this.store.readAll().filter(d => d.assignedTo === adminId);
  }

  create(dto: CreateDisputeDto): DisputeRecord {
    const data = this.store.readAll();
    const d: DisputeRecord = {
      id: this.store.getNextId('DSP'),
      txnId: dto.txnId,
      customerId: dto.customerId,
      amount: dto.amount,
      reason: dto.reason,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      description: dto.description,
      raisedBy: dto.raisedBy ?? dto.customerId,
      assignedTo: dto.assignedTo ?? 'admin.a@nexuspay',
    };
    data.unshift(d);
    this.store.writeAll(data);
    return d;
  }

  update(id: string, dto: UpdateDisputeDto): DisputeRecord {
    const data = this.store.readAll();
    const d = data.find(x => x.id === id);
    if (!d) throw new NotFoundException(`Dispute ${id} not found`);
    Object.assign(d, dto);
    this.store.writeAll(data);
    return d;
  }

  updateStatus(id: string, status: string): DisputeRecord {
    const data = this.store.readAll();
    const d = data.find(x => x.id === id);
    if (!d) throw new NotFoundException(`Dispute ${id} not found`);
    d.status = status;
    this.store.writeAll(data);
    return d;
  }

  remove(id: string): void {
    const data = this.store.readAll();
    const idx = data.findIndex(d => d.id === id);
    if (idx === -1) throw new NotFoundException(`Dispute ${id} not found`);
    data.splice(idx, 1);
    this.store.writeAll(data);
  }

  getCounts(): DisputeCounts {
    const data = this.store.readAll();
    return {
      total: data.length,
      pending: data.filter(d => d.status === 'Pending').length,
      review: data.filter(d => d.status === 'In Review').length,
      solved: data.filter(d => d.status === 'Solved').length,
    };
  }
}
