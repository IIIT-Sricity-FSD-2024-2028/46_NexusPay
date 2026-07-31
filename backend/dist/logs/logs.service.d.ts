export interface LogRecord {
    id: string;
    timestamp: string;
    user: string;
    action: string;
    module: string;
    severity: string;
    details: string;
}
export interface CreateLogDto {
    user: string;
    action: string;
    module: string;
    severity?: string;
    details?: string;
}
export interface LogFilters {
    module?: string;
    severity?: string;
}
export declare class LogsService {
    private store;
    findAll(filters?: LogFilters): LogRecord[];
    create(data: CreateLogDto): LogRecord;
    remove(id: string): void;
}
