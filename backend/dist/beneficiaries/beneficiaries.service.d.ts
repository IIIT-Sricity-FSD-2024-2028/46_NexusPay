import { BeneficiariesRepository, BeneficiaryRecord } from './beneficiaries.repository';
import { UsersRepository } from '../users/users.repository';
export interface CreateBeneficiaryInput {
    userId: string;
    name: string;
    beneficiaryId: string;
}
export declare class BeneficiariesService {
    private repo;
    private usersRepo;
    constructor(repo: BeneficiariesRepository, usersRepo: UsersRepository);
    private resolveVpa;
    findByUser(userId: string): BeneficiaryRecord[];
    findAll(): BeneficiaryRecord[];
    create(data: CreateBeneficiaryInput): BeneficiaryRecord;
    remove(id: string): void;
}
