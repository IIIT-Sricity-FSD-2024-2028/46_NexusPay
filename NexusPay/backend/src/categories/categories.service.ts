import { Injectable, NotFoundException } from '@nestjs/common';
import { JsonStore } from '../common/json-store';

export interface CategoryRecord {
  id: string;
  name: string;
  description: string;
}

export interface CategoryInput {
  name: string;
  description: string;
}

const SEED: CategoryRecord[] = [
  { id: 'cat1', name: 'Food & Dining', description: 'Restaurants, delivery, groceries' },
  { id: 'cat2', name: 'Shopping', description: 'E-commerce, retail purchases' },
  { id: 'cat3', name: 'Entertainment', description: 'Movies, subscriptions, gaming' },
  { id: 'cat4', name: 'Transport', description: 'Ride-hailing, fuel, public transport' },
  { id: 'cat5', name: 'Utilities', description: 'Electricity, water, internet' },
  { id: 'cat6', name: 'Housing', description: 'Rent, maintenance' },
  { id: 'cat7', name: 'Friends & Family', description: 'P2P transfers' },
  { id: 'cat8', name: 'Retail', description: 'In-store purchases' },
  { id: 'cat9', name: 'Services', description: 'Professional services' },
  { id: 'cat10', name: 'Others', description: 'Miscellaneous' },
];

@Injectable()
export class CategoriesService {
  private store = new JsonStore<CategoryRecord>('categories.json', SEED);

  findAll(): CategoryRecord[] { return this.store.readAll(); }

  create(data: CategoryInput): CategoryRecord {
    const all = this.store.readAll();
    const c: CategoryRecord = {
      id: this.store.getNextId('cat', 'id', 1),
      name: data.name,
      description: data.description,
    };
    all.push(c);
    this.store.writeAll(all);
    return c;
  }

  update(id: string, data: Partial<CategoryInput>): CategoryRecord {
    const all = this.store.readAll();
    const c = all.find(x => x.id === id);
    if (!c) throw new NotFoundException(`Category ${id} not found`);
    Object.assign(c, data);
    this.store.writeAll(all);
    return c;
  }

  remove(id: string): void {
    const all = this.store.readAll();
    const idx = all.findIndex(c => c.id === id);
    if (idx !== -1) { all.splice(idx, 1); this.store.writeAll(all); }
  }
}
