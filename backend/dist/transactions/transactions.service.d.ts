import { TransactionsRepository, TransactionRecord } from './transactions.repository';
import { UsersRepository } from '../users/users.repository';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
export interface TransactionFilters {
    status?: string;
    type?: string;
    search?: string;
}
export interface TransactionStats {
    total: number;
    completed: number;
    pending: number;
    failed: number;
    totalAmount: number;
}
export declare class TransactionsService {
    private repo;
    private usersRepo;
    constructor(repo: TransactionsRepository, usersRepo: UsersRepository);
    findAll(filters?: TransactionFilters): TransactionRecord[];
    findOne(id: string): TransactionRecord;
    findByUser(userId: string, filters?: TransactionFilters): TransactionRecord[];
    create(dto: CreateTransactionDto): TransactionRecord;
    update(id: string, dto: UpdateTransactionDto): TransactionRecord;
    remove(id: string): void;
    getStats(): TransactionStats;
}
