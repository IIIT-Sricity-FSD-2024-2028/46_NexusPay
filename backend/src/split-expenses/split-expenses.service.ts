import { Injectable, NotFoundException } from '@nestjs/common';
import { SplitExpensesRepository, SplitRecord, SplitMember } from './split-expenses.repository';
import { UsersRepository } from '../users/users.repository';

export interface CreateSplitInput {
  userId?: string;
  name: string;
  members?: SplitMember[];
  totalAmount?: number;
  description?: string;
}

export interface UpdateSplitInput {
  name?: string;
  members?: SplitMember[];
  totalAmount?: number;
  description?: string;
  status?: string;
}

@Injectable()
export class SplitExpensesService {
  constructor(
    private repo: SplitExpensesRepository,
    private usersRepo: UsersRepository,
  ) {}

  private resolveVpa(userId: string): string | null {
    const user = this.usersRepo.findById(userId);
    return user?.vpa ?? null;
  }

  findByUser(userId: string): SplitRecord[] {
    const vpa = this.resolveVpa(userId);
    return this.repo.findAll().filter(s => {
      const isCreator = s.createdBy === userId || (vpa != null && s.createdBy === vpa);
      const isMember = s.members.some(
        m => m.memberId === userId || (vpa != null && m.memberId === vpa),
      );
      return isCreator || isMember;
    });
  }

  findAll(): SplitRecord[] { return this.repo.findAll(); }

  findOne(id: string): SplitRecord {
    const split = this.repo.findById(id);
    if (!split) throw new NotFoundException(`Split ${id} not found`);
    return split;
  }

  create(input: CreateSplitInput): SplitRecord {
    const userId = input.userId ?? 'john.c@nexuspay';
    const vpa = this.resolveVpa(userId);
    const split: SplitRecord = {
      id: this.repo.nextId(),
      name: input.name,
      createdBy: vpa ?? userId,
      members: input.members ?? [],
      totalAmount: input.totalAmount ?? 0,
      settled: 0,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      description: input.description ?? '',
    };
    return this.repo.save(split);
  }

  update(id: string, input: UpdateSplitInput): SplitRecord {
    const existing = this.repo.findById(id);
    if (!existing) throw new NotFoundException(`Split ${id} not found`);

    const members = input.members ?? existing.members;
    const settled = members.filter(m => m.paid).reduce((acc, m) => acc + m.share, 0);
    const totalAmount = input.totalAmount ?? existing.totalAmount;
    const status = settled >= totalAmount ? 'completed' : (input.status ?? existing.status);

    const updated = this.repo.update(id, { ...input, members, settled, status });
    if (!updated) throw new NotFoundException(`Split ${id} not found`);
    return updated;
  }

  remove(id: string): void {
    const deleted = this.repo.deleteById(id);
    if (!deleted) throw new NotFoundException(`Split ${id} not found`);
  }
}
