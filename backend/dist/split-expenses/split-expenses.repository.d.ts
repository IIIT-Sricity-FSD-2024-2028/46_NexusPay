export interface SplitMember {
    memberId: string;
    share: number;
    paid: boolean;
}
export interface SplitRecord {
    id: string;
    name: string;
    createdBy: string;
    members: SplitMember[];
    totalAmount: number;
    settled: number;
    date: string;
    status: string;
    description: string;
}
export declare class SplitExpensesRepository {
    private store;
    findAll(): SplitRecord[];
    findByUserId(userId: string): SplitRecord[];
    findById(id: string): SplitRecord | undefined;
    nextId(): string;
    save(split: SplitRecord): SplitRecord;
    update(id: string, partial: Partial<SplitRecord>): SplitRecord | undefined;
    deleteById(id: string): boolean;
}
