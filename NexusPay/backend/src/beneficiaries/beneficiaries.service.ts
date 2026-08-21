import { Injectable, NotFoundException } from '@nestjs/common';
import { BeneficiariesRepository, BeneficiaryRecord } from './beneficiaries.repository';
import { UsersRepository } from '../users/users.repository';

export interface CreateBeneficiaryInput {
  userId: string;
  name: string;
  beneficiaryId: string;
}

@Injectable()
export class BeneficiariesService {
  constructor(
    private repo: BeneficiariesRepository,
    private usersRepo: UsersRepository,
  ) {}

  private resolveVpa(userId: string): string | null {
    const user = this.usersRepo.findById(userId);
    return user?.vpa ?? null;
  }

  findByUser(userId: string): BeneficiaryRecord[] {
    const vpa = this.resolveVpa(userId);
    const all = this.repo.findAll();
    return all.filter(b => b.userId === userId || (vpa != null && b.userId === vpa));
  }

  findAll(): BeneficiaryRecord[] { return this.repo.findAll(); }

  create(data: CreateBeneficiaryInput): BeneficiaryRecord {
    const vpa = this.resolveVpa(data.userId);
    const beneficiary: BeneficiaryRecord = {
      id: this.repo.nextId(),
      userId: vpa ?? data.userId,
      name: data.name,
      beneficiaryId: data.beneficiaryId,
    };
    return this.repo.save(beneficiary);
  }

  remove(id: string): void {
    const deleted = this.repo.deleteById(id);
    if (!deleted) throw new NotFoundException(`Beneficiary ${id} not found`);
  }
}
