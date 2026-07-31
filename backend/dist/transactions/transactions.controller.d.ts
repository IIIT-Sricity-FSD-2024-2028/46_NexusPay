import { TransactionsService } from './transactions.service';
import type { TransactionStats } from './transactions.service';
import type { TransactionRecord } from './transactions.repository';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { LogsService } from '../logs/logs.service';
import { UsersService } from '../users/users.service';
import { BankAccountsService } from '../bank-accounts/bank-accounts.service';
export declare class TransactionsController {
    private service;
    private notificationsService;
    private logsService;
    private usersService;
    private bankAccountsService;
    constructor(service: TransactionsService, notificationsService: NotificationsService, logsService: LogsService, usersService: UsersService, bankAccountsService: BankAccountsService);
    findAll(status?: string, type?: string, search?: string, user?: string): TransactionRecord[];
    getStats(): TransactionStats;
    findOne(id: string): TransactionRecord;
    create(dto: CreateTransactionDto): TransactionRecord;
    private tryNotifyReceiver;
    update(id: string, dto: UpdateTransactionDto): TransactionRecord;
    remove(id: string): {
        message: string;
    };
}
