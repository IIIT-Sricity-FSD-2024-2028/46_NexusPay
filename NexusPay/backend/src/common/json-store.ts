import * as fs from 'fs';
import * as path from 'path';

export class JsonStore<T extends object> {
  private filePath: string;
  private defaults: T[];

  constructor(filename: string, defaults: T[]) {
    this.defaults = defaults;
    const dataDir = path.join(__dirname, '..', '..', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    this.filePath = path.join(dataDir, filename);
    if (!fs.existsSync(this.filePath)) {
      this.writeAll(this.defaults);
    }
  }

  readAll(): T[] {
    try {
      const raw = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(raw) as T[];
    } catch {
      this.writeAll(this.defaults);
      return [...this.defaults];
    }
  }

  writeAll(data: T[]): void {
    const tmpPath = this.filePath + '.tmp';
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tmpPath, this.filePath);
  }

  getNextId(prefix: string, idField: keyof T = 'id' as keyof T, padLength = 3): string {
    const data = this.readAll();
    let maxNum = 0;
    for (const item of data) {
      const id: unknown = item[idField];
      if (typeof id === 'string' && id.startsWith(prefix)) {
        const numPart = parseInt(id.slice(prefix.length), 10);
        if (!isNaN(numPart) && numPart > maxNum) {
          maxNum = numPart;
        }
      }
    }
    return `${prefix}${String(maxNum + 1).padStart(padLength, '0')}`;
  }

  getNextNumericId(idField: keyof T = 'id' as keyof T): number {
    const data = this.readAll();
    let maxId = 0;
    for (const item of data) {
      const id: unknown = item[idField];
      if (typeof id === 'number' && id > maxId) {
        maxId = id;
      }
    }
    return maxId + 1;
  }
}
