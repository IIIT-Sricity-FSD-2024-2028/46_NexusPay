import { Injectable } from '@nestjs/common';
import { JsonStore } from '../common/json-store';

export interface BeneficiaryRecord {
  id: string;
  userId: string;
  name: string;
  beneficiaryId: string;
}

const SEED: BeneficiaryRecord[] = [
  { id: 'b1', userId: 'john.c@nexuspay', name: 'Anjali Mehta', beneficiaryId: 'raj.c@nexuspay' },
  { id: 'b2', userId: 'john.c@nexuspay', name: 'Priya Sharma', beneficiaryId: 'sarah.c@nexuspay' },
  { id: 'b3', userId: 'john.c@nexuspay', name: 'Rahul Kumar', beneficiaryId: 'alice.c@nexuspay' },
  { id: 'b4', userId: 'john.c@nexuspay', name: 'Sneha Patel', beneficiaryId: 'bob.c@nexuspay' },
  { id: 'b5', userId: 'john.c@nexuspay', name: 'Vikram Singh', beneficiaryId: 'emma.c@nexuspay' },
  { id: 'b6', userId: 'john.c@nexuspay', name: 'Kavita Joshi', beneficiaryId: 'david.c@nexuspay' },
  { id: 'b7', userId: 'john.c@nexuspay', name: 'Arjun Nair', beneficiaryId: 'tom.c@nexuspay' },
  { id: 'b8', userId: 'john.c@nexuspay', name: 'Meera Reddy', beneficiaryId: 'priya.c@nexuspay' },
];

@Injectable()
export class BeneficiariesRepository {
  private store = new JsonStore<BeneficiaryRecord>('beneficiaries.json', SEED);

  findAll(): BeneficiaryRecord[] { return this.store.readAll(); }
  findByUserId(userId: string): BeneficiaryRecord[] { return this.store.readAll().filter(b => b.userId === userId); }
  findById(id: string): BeneficiaryRecord | undefined { return this.store.readAll().find(b => b.id === id); }
  nextId(): string { return this.store.getNextId('b', 'id', 1); }

  save(beneficiary: BeneficiaryRecord): BeneficiaryRecord {
    const all = this.store.readAll();
    all.push(beneficiary);
    this.store.writeAll(all);
    return beneficiary;
  }

  deleteById(id: string): boolean {
    const data = this.store.readAll();
    const idx = data.findIndex(b => b.id === id);
    if (idx === -1) return false;
    data.splice(idx, 1);
    this.store.writeAll(data);
    return true;
  }
}
