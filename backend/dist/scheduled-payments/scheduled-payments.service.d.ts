import { CreateScheduledPaymentDto } from './dto/create-scheduled-payment.dto';
import { UpdateScheduledPaymentDto } from './dto/update-scheduled-payment.dto';
export interface ScheduledPaymentRecord {
    id: string;
    userId: string;
    title: string;
    receiverId: string;
    amount: number;
    frequency: string;
    nextPayment: string;
    status: string;
    type: string;
}
export declare class ScheduledPaymentsService {
    private store;
    findByUser(userId: string): ScheduledPaymentRecord[];
    findAll(): ScheduledPaymentRecord[];
    findOne(id: string): ScheduledPaymentRecord;
    create(dto: CreateScheduledPaymentDto): ScheduledPaymentRecord;
    update(id: string, dto: UpdateScheduledPaymentDto): ScheduledPaymentRecord;
    remove(id: string): void;
}
