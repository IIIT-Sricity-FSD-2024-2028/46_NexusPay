import { LogsService } from './logs.service';
import type { LogRecord, CreateLogDto } from './logs.service';
export declare class LogsController {
    private service;
    constructor(service: LogsService);
    findAll(module?: string, severity?: string): LogRecord[];
    create(body: CreateLogDto): LogRecord;
    remove(id: string): {
        message: string;
    };
}
