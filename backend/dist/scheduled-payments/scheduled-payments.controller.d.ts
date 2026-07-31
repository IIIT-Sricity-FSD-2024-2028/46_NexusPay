import { ScheduledPaymentsService } from './scheduled-payments.service';
import type { ScheduledPaymentRecord } from './scheduled-payments.service';
import { CreateScheduledPaymentDto } from './dto/create-scheduled-payment.dto';
import { UpdateScheduledPaymentDto } from './dto/update-scheduled-payment.dto';
export declare class ScheduledPaymentsController {
    private service;
    constructor(service: ScheduledPaymentsService);
    findAll(userId?: string): ScheduledPaymentRecord[];
    findOne(id: string): ScheduledPaymentRecord;
    create(dto: CreateScheduledPaymentDto): ScheduledPaymentRecord;
    update(id: string, dto: UpdateScheduledPaymentDto): ScheduledPaymentRecord;
    remove(id: string): {
        message: string;
    };
}
