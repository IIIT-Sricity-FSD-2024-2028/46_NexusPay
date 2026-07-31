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
export declare class SplitExpensesService {
    private repo;
    private usersRepo;
    constructor(repo: SplitExpensesRepository, usersRepo: UsersRepository);
    private resolveVpa;
    findByUser(userId: string): SplitRecord[];
    findAll(): SplitRecord[];
    findOne(id: string): SplitRecord;
    create(input: CreateSplitInput): SplitRecord;
    update(id: string, input: UpdateSplitInput): SplitRecord;
    remove(id: string): void;
}
