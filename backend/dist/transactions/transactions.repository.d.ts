export interface TransactionRecord {
    id: string;
    senderId: string;
    receiverId: string;
    amount: number;
    type: string;
    status: string;
    category: string;
    date: string;
}
export declare class TransactionsRepository {
    private store;
    findAll(): TransactionRecord[];
    findById(id: string): TransactionRecord | undefined;
    nextId(): string;
    save(transaction: TransactionRecord): TransactionRecord;
    update(id: string, partial: Partial<TransactionRecord>): TransactionRecord | undefined;
    deleteById(id: string): boolean;
}
