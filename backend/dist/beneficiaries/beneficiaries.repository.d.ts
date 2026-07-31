export interface BeneficiaryRecord {
    id: string;
    userId: string;
    name: string;
    beneficiaryId: string;
}
export declare class BeneficiariesRepository {
    private store;
    findAll(): BeneficiaryRecord[];
    findByUserId(userId: string): BeneficiaryRecord[];
    findById(id: string): BeneficiaryRecord | undefined;
    nextId(): string;
    save(beneficiary: BeneficiaryRecord): BeneficiaryRecord;
    deleteById(id: string): boolean;
}
