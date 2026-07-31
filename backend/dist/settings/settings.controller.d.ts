import { SettingsService } from './settings.service';
import type { SettingsRecord } from './settings.service';
export declare class SettingsController {
    private service;
    constructor(service: SettingsService);
    findOne(userId: string): SettingsRecord;
    update(userId: string, body: Partial<SettingsRecord>): SettingsRecord;
}
