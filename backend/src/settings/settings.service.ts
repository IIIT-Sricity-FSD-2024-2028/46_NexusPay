import { Injectable } from '@nestjs/common';
import { JsonStore } from '../common/json-store';

export interface PrivacySettings {
  showProfile: boolean;
  showTransactions: boolean;
}

export interface SettingsRecord {
  userId: string;
  name: string;
  email: string;
  theme: string;
  privacy: PrivacySettings;
}

const SEED: SettingsRecord[] = [
  {
    userId: 'john.c@nexuspay', name: 'Rajesh Kumar', email: 'rajesh@nexuspay.com',
    theme: 'dark', privacy: { showProfile: true, showTransactions: false },
  },
  {
    userId: 'admin.a@nexuspay', name: 'Admin User', email: 'admin@nexuspay.com',
    theme: 'dark', privacy: { showProfile: true, showTransactions: true },
  },
  {
    userId: 'super.s@nexuspay', name: 'Super Admin', email: 'super@nexuspay.com',
    theme: 'dark', privacy: { showProfile: true, showTransactions: true },
  },
];

@Injectable()
export class SettingsService {
  private store = new JsonStore<SettingsRecord>('settings.json', SEED);

  findByUser(userId: string): SettingsRecord {
    const data = this.store.readAll();
    const s = data.find(x => x.userId === userId);
    if (!s) {
      const def: SettingsRecord = {
        userId, name: '', email: '', theme: 'dark',
        privacy: { showProfile: true, showTransactions: false },
      };
      data.push(def);
      this.store.writeAll(data);
      return def;
    }
    return s;
  }

  update(userId: string, input: Partial<SettingsRecord>): SettingsRecord {
    const data = this.store.readAll();
    let s = data.find(x => x.userId === userId);
    if (!s) {
      s = {
        userId, name: '', email: '', theme: 'dark',
        privacy: { showProfile: true, showTransactions: false },
      };
      data.push(s);
    }
    Object.assign(s, input);
    this.store.writeAll(data);
    return s;
  }
}
