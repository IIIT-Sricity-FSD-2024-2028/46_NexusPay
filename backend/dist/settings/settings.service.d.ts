export interface PrivacySettings {
    showProfile: boolean;
    showTransactions: boolean;
}
export interface SettingsRecord {
    userId: string;
    name: string;
    email: string;
    theme: string;
    privacy: PrivacySettings;
}
export declare class SettingsService {
    private store;
    findByUser(userId: string): SettingsRecord;
    update(userId: string, input: Partial<SettingsRecord>): SettingsRecord;
}
