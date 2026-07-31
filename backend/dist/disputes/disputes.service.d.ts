import { CreateDisputeDto } from './dto/create-dispute.dto';
import { UpdateDisputeDto } from './dto/update-dispute.dto';
export interface DisputeRecord {
    id: string;
    txnId: string;
    customerId: string;
    amount: number;
    reason: string;
    status: string;
    date: string;
    raisedBy: string;
    assignedTo: string;
    description?: string;
}
export interface DisputeCounts {
    total: number;
    pending: number;
    review: number;
    solved: number;
}
export declare class DisputesService {
    private store;
    findAll(status?: string): DisputeRecord[];
    findOne(id: string): DisputeRecord;
    findByCustomer(customerId: string): DisputeRecord[];
    findByRaisedBy(userId: string): DisputeRecord[];
    findByAssignedTo(adminId: string): DisputeRecord[];
    create(dto: CreateDisputeDto): DisputeRecord;
    update(id: string, dto: UpdateDisputeDto): DisputeRecord;
    updateStatus(id: string, status: string): DisputeRecord;
    remove(id: string): void;
    getCounts(): DisputeCounts;
}
