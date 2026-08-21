import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionsRepository, TransactionRecord } from './transactions.repository';
import { UsersRepository } from '../users/users.repository';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

export interface TransactionFilters {
  status?: string;
  type?: string;
  search?: string;
}

export interface TransactionStats {
  total: number;
  completed: number;
  pending: number;
  failed: number;
  totalAmount: number;
}

@Injectable()
export class TransactionsService {
  constructor(
    private repo: TransactionsRepository,
    private usersRepo: UsersRepository,
  ) {}

  findAll(filters?: TransactionFilters): TransactionRecord[] {
    let data = this.repo.findAll();
    if (filters?.status && filters.status !== 'all') {
      const s = filters.status.toLowerCase();
      data = data.filter(t => t.status.toLowerCase() === s);
    }
    if (filters?.type && filters.type !== 'all') {
      data = data.filter(t => t.type === filters.type);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      data = data.filter(
        t =>
          t.id.toLowerCase().includes(q) ||
          t.senderId.toLowerCase().includes(q) ||
          t.receiverId.toLowerCase().includes(q),
      );
    }
    return data;
  }

  findOne(id: string): TransactionRecord {
    const txn = this.repo.findById(id);
    if (!txn) throw new NotFoundException(`Transaction ${id} not found`);
    return txn;
  }

  findByUser(userId: string, filters?: TransactionFilters): TransactionRecord[] {
    const userRecord = this.usersRepo.findById(userId);
    const vpa = userRecord?.vpa;
    let data = this.repo.findAll();
    data = data.filter(t => {
      const sId = t.senderId.toLowerCase();
      const rId = t.receiverId.toLowerCase();
      const q = userId.toLowerCase();
      return (
        sId === q ||
        rId === q ||
        (vpa != null && (sId === vpa.toLowerCase() || rId === vpa.toLowerCase()))
      );
    });
    if (filters?.status && filters.status !== 'all') {
      const s = filters.status.toLowerCase();
      data = data.filter(t => t.status.toLowerCase() === s);
    }
    if (filters?.type && filters.type !== 'all') {
      data = data.filter(t => t.type === filters.type);
    }
    if (filters?.search) {
      const sq = filters.search.toLowerCase();
      data = data.filter(
        t =>
          t.id.toLowerCase().includes(sq) ||
          t.senderId.toLowerCase().includes(sq) ||
          t.receiverId.toLowerCase().includes(sq),
      );
    }
    return data;
  }

  create(dto: CreateTransactionDto): TransactionRecord {
    const txn: TransactionRecord = {
      id: this.repo.nextId(),
      senderId: dto.senderId,
      receiverId: dto.receiverId,
      amount: dto.amount,
      type: dto.type,
      category: dto.category ?? 'General',
      status: dto.status ?? 'Completed',
      date: new Date().toLocaleString('en-IN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: true,
      }),
    };
    return this.repo.save(txn);
  }

  update(id: string, dto: UpdateTransactionDto): TransactionRecord {
    const updated = this.repo.update(id, dto);
    if (!updated) throw new NotFoundException(`Transaction ${id} not found`);
    return updated;
  }

  remove(id: string): void {
    const deleted = this.repo.deleteById(id);
    if (!deleted) throw new NotFoundException(`Transaction ${id} not found`);
  }

  getStats(): TransactionStats {
    const data = this.repo.findAll();
    return {
      total: data.length,
      completed: data.filter(t => t.status === 'Completed').length,
      pending: data.filter(t => t.status === 'Pending').length,
      failed: data.filter(t => t.status === 'Failed').length,
      totalAmount: data.reduce((s, t) => s + t.amount, 0),
    };
  }
}
