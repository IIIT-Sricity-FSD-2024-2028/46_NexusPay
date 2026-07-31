import { BankAccountsRepository, BankAccountRecord } from './bank-accounts.repository';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
export declare class BankAccountsService {
    private repo;
    constructor(repo: BankAccountsRepository);
    findByUser(userId: string): BankAccountRecord[];
    findAll(): BankAccountRecord[];
    findOne(id: string): BankAccountRecord;
    create(dto: CreateBankAccountDto): BankAccountRecord;
    update(id: string, dto: UpdateBankAccountDto): BankAccountRecord;
    deductBalance(userId: string, amount: number): void;
    creditBalance(userId: string, amount: number): void;
    remove(id: string): void;
}
