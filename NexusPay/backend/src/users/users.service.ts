import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository, UserRecord } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private repo: UsersRepository) {}

  findAll(role?: string): UserRecord[] {
    const data = this.repo.findAll();
    if (role) return data.filter(u => u.role === role);
    return data;
  }

  findOne(id: string): UserRecord {
    const user = this.repo.findById(id);
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  findByEmail(email: string): UserRecord | undefined {
    return this.repo.findByEmail(email);
  }

  create(dto: CreateUserDto, password: string): UserRecord {
    const user: UserRecord = {
      id: this.repo.nextId(dto.role),
      email: dto.email,
      password,
      role: dto.role,
      status: dto.status ?? 'Active',
      joined: new Date().toISOString().split('T')[0],
      txns: 0,
    };
    return this.repo.save(user);
  }

  update(id: string, dto: UpdateUserDto): UserRecord {
    const updated = this.repo.update(id, dto);
    if (!updated) throw new NotFoundException(`User #${id} not found`);
    return updated;
  }

  updateStatus(id: string, status: string): UserRecord {
    const updated = this.repo.update(id, { status });
    if (!updated) throw new NotFoundException(`User #${id} not found`);
    return updated;
  }

  incrementTxns(id: string): void {
    const user = this.repo.findById(id);
    if (user) {
      this.repo.update(id, { txns: (user.txns ?? 0) + 1 });
    }
  }

  remove(id: string): void {
    const deleted = this.repo.deleteById(id);
    if (!deleted) throw new NotFoundException(`User #${id} not found`);
  }

  getCustomers(): UserRecord[] { return this.repo.findAll().filter(u => u.role === 'customer'); }
  getMerchants(): UserRecord[] { return this.repo.findAll().filter(u => u.role === 'merchant'); }
  getAdmins(): UserRecord[] { return this.repo.findAll().filter(u => u.role === 'admin' || u.role === 'superuser'); }
}
