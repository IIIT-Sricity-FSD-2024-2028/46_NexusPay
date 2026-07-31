import { BankAccountsService } from './bank-accounts.service';
import type { BankAccountRecord } from './bank-accounts.repository';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
export declare class BankAccountsController {
    private service;
    constructor(service: BankAccountsService);
    findAll(userId?: string): BankAccountRecord[];
    findOne(id: string): BankAccountRecord;
    create(dto: CreateBankAccountDto): BankAccountRecord;
    deduct(body: {
        userId: string;
        amount: number;
    }): {
        success: boolean;
        message: string;
    };
    credit(body: {
        userId: string;
        amount: number;
    }): {
        success: boolean;
        message: string;
    };
    update(id: string, dto: UpdateBankAccountDto): BankAccountRecord;
    remove(id: string): {
        message: string;
    };
}
