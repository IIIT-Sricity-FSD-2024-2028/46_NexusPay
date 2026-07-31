import { DisputesService } from './disputes.service';
import type { DisputeRecord, DisputeCounts } from './disputes.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { UpdateDisputeDto } from './dto/update-dispute.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { LogsService } from '../logs/logs.service';
export declare class DisputesController {
    private service;
    private notificationsService;
    private logsService;
    constructor(service: DisputesService, notificationsService: NotificationsService, logsService: LogsService);
    findAll(status?: string, customer?: string, raisedBy?: string, assignedTo?: string): DisputeRecord[];
    getCounts(): DisputeCounts;
    findOne(id: string): DisputeRecord;
    create(dto: CreateDisputeDto): DisputeRecord;
    update(id: string, dto: UpdateDisputeDto): DisputeRecord;
    updateStatus(id: string, status: string): DisputeRecord;
    remove(id: string): {
        message: string;
    };
}
