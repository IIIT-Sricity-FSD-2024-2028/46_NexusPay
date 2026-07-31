import { BeneficiariesService } from './beneficiaries.service';
import type { CreateBeneficiaryInput } from './beneficiaries.service';
import type { BeneficiaryRecord } from './beneficiaries.repository';
export declare class BeneficiariesController {
    private service;
    constructor(service: BeneficiariesService);
    findAll(userId?: string): BeneficiaryRecord[];
    create(body: CreateBeneficiaryInput): BeneficiaryRecord;
    remove(id: string): {
        message: string;
    };
}
