import { Injectable, NotFoundException } from '@nestjs/common';
import { BankAccountsRepository, BankAccountRecord } from './bank-accounts.repository';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';

@Injectable()
export class BankAccountsService {
  constructor(private repo: BankAccountsRepository) {}

  findByUser(userId: string): BankAccountRecord[] { return this.repo.findByUser(userId); }
  findAll(): BankAccountRecord[] { return this.repo.findAll(); }

  findOne(id: string): BankAccountRecord {
    const a = this.repo.findById(id);
    if (!a) throw new NotFoundException(`Bank account ${id} not found`);
    return a;
  }

  create(dto: CreateBankAccountDto): BankAccountRecord {
    const account: BankAccountRecord = {
      id: this.repo.nextId(),
      userId: dto.userId ?? 'john.c@nexuspay',
      bankName: dto.bankName,
      holderName: dto.holderName,
      accountNum: dto.accountNum.slice(-4),
      ifsc: dto.ifsc,
      balance: dto.balance ?? 0,
      primary: dto.primary ?? false,
    };
    return this.repo.save(account);
  }

  update(id: string, dto: UpdateBankAccountDto): BankAccountRecord {
    if (dto.primary) {
      const existing = this.repo.findById(id);
      if (existing) this.repo.clearPrimary(existing.userId);
    }
    const updated = this.repo.update(id, dto);
    if (!updated) throw new NotFoundException(`Bank account ${id} not found`);
    return updated;
  }

  deductBalance(userId: string, amount: number): void { this.repo.deductBalance(userId, amount); }
  creditBalance(userId: string, amount: number): void { this.repo.creditBalance(userId, amount); }

  remove(id: string): void {
    const deleted = this.repo.deleteById(id);
    if (!deleted) throw new NotFoundException(`Bank account ${id} not found`);
  }
}
