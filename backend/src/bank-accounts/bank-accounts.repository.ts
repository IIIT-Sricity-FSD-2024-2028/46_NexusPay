import { Injectable } from '@nestjs/common';
import { JsonStore } from '../common/json-store';

export interface BankAccountRecord {
  id: string;
  userId: string;
  bankName: string;
  holderName: string;
  accountNum: string;
  ifsc: string;
  balance: number;
  primary: boolean;
}

const SEED: BankAccountRecord[] = [
  { id: 'ba1', userId: 'john.c@nexuspay', bankName: 'HDFC Bank', holderName: 'Rajesh Kumar', accountNum: '1234', ifsc: 'HDFC0001234', balance: 88250.50, primary: true },
  { id: 'ba2', userId: 'john.c@nexuspay', bankName: 'ICICI Bank', holderName: 'Rajesh Kumar', accountNum: '5678', ifsc: 'ICIC0005678', balance: 43200.00, primary: false },
  { id: 'ba3', userId: 'john.c@nexuspay', bankName: 'State Bank of India', holderName: 'Rajesh Kumar', accountNum: '9012', ifsc: 'SBIN0009012', balance: 28750.00, primary: false },
  { id: 'ba4', userId: 'amazon.m@nexuspay', bankName: 'HDFC Bank', holderName: 'Amazon India Pvt Ltd', accountNum: '4401', ifsc: 'HDFC0004401', balance: 524800, primary: true },
  { id: 'ba5', userId: 'amazon.m@nexuspay', bankName: 'ICICI Bank', holderName: 'Amazon India Pvt Ltd', accountNum: '7823', ifsc: 'ICIC0007823', balance: 218500, primary: false },
  { id: 'ba6', userId: 'amazon.m@nexuspay', bankName: 'Axis Bank', holderName: 'Amazon India Pvt Ltd', accountNum: '3356', ifsc: 'UTIB0003356', balance: 97200, primary: false },
];

@Injectable()
export class BankAccountsRepository {
  private store = new JsonStore<BankAccountRecord>('bank-accounts.json', SEED);

  findAll(): BankAccountRecord[] { return this.store.readAll(); }
  findByUser(userId: string): BankAccountRecord[] { return this.store.readAll().filter(a => a.userId === userId); }
  findById(id: string): BankAccountRecord | undefined { return this.store.readAll().find(a => a.id === id); }
  findPrimary(userId: string): BankAccountRecord | undefined { return this.store.readAll().find(a => a.userId === userId && a.primary); }
  nextId(): string { return this.store.getNextId('ba', 'id', 1); }

  save(account: BankAccountRecord): BankAccountRecord {
    const data = this.store.readAll();
    data.push(account);
    this.store.writeAll(data);
    return account;
  }

  update(id: string, partial: Partial<BankAccountRecord>): BankAccountRecord | undefined {
    const data = this.store.readAll();
    const record = data.find(a => a.id === id);
    if (!record) return undefined;
    Object.assign(record, partial);
    this.store.writeAll(data);
    return record;
  }

  clearPrimary(userId: string): void {
    const data = this.store.readAll();
    data.forEach(a => { if (a.userId === userId) a.primary = false; });
    this.store.writeAll(data);
  }

  creditBalance(userId: string, amount: number): void {
    const data = this.store.readAll();
    const primary = data.find(a => a.userId === userId && a.primary);
    if (primary) { primary.balance += amount; this.store.writeAll(data); }
  }

  deductBalance(userId: string, amount: number): void {
    const data = this.store.readAll();
    const primary = data.find(a => a.userId === userId && a.primary);
    if (primary) {
      primary.balance = Math.max(0, primary.balance - amount);
      this.store.writeAll(data);
    }
  }

  deleteById(id: string): boolean {
    const data = this.store.readAll();
    const idx = data.findIndex(a => a.id === id);
    if (idx === -1) return false;
    data.splice(idx, 1);
    this.store.writeAll(data);
    return true;
  }
}
