export interface BankAccountRecord {
    id: string;
    userId: string;
    bankName: string;
    holderName: string;
    accountNum: string;
    ifsc: string;
    balance: number;
    primary: boolean;
}
export declare class BankAccountsRepository {
    private store;
    findAll(): BankAccountRecord[];
    findByUser(userId: string): BankAccountRecord[];
    findById(id: string): BankAccountRecord | undefined;
    findPrimary(userId: string): BankAccountRecord | undefined;
    nextId(): string;
    save(account: BankAccountRecord): BankAccountRecord;
    update(id: string, partial: Partial<BankAccountRecord>): BankAccountRecord | undefined;
    clearPrimary(userId: string): void;
    creditBalance(userId: string, amount: number): void;
    deductBalance(userId: string, amount: number): void;
    deleteById(id: string): boolean;
}
