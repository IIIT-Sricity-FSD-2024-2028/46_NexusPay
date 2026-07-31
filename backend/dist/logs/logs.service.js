"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogsService = void 0;
const common_1 = require("@nestjs/common");
const json_store_1 = require("../common/json-store");
const SEED = [
    { id: 'log1', timestamp: '2024-03-28 14:30:00', user: 'Admin User', action: 'User Status Update', module: 'Users', severity: 'warning', details: 'Changed user #4 status to Inactive' },
    { id: 'log2', timestamp: '2024-03-28 14:15:00', user: 'Admin User', action: 'Dispute Reviewed', module: 'Disputes', severity: 'info', details: 'Dispute DSP003 moved to In Review' },
    { id: 'log3', timestamp: '2024-03-28 13:45:00', user: 'Super Admin', action: 'Role Updated', module: 'Roles', severity: 'critical', details: 'Changed permissions for admin role' },
    { id: 'log4', timestamp: '2024-03-28 12:30:00', user: 'Admin User', action: 'Transaction Flagged', module: 'Transactions', severity: 'warning', details: 'TXN015 flagged for review - high amount' },
    { id: 'log5', timestamp: '2024-03-28 11:00:00', user: 'System', action: 'Backup Completed', module: 'System', severity: 'info', details: 'Daily backup completed successfully' },
    { id: 'log6', timestamp: '2024-03-28 10:30:00', user: 'Super Admin', action: 'New Merchant Added', module: 'Users', severity: 'info', details: 'Merchant "QuickMart" registered' },
    { id: 'log7', timestamp: '2024-03-27 16:45:00', user: 'Admin User', action: 'Dispute Resolved', module: 'Disputes', severity: 'info', details: 'Dispute DSP005 marked as Solved' },
    { id: 'log8', timestamp: '2024-03-27 15:15:00', user: 'System', action: 'Security Alert', module: 'Security', severity: 'critical', details: 'Multiple failed login attempts detected for user #7' },
];
let LogsService = class LogsService {
    store = new json_store_1.JsonStore('logs.json', SEED);
    findAll(filters) {
        let data = this.store.readAll();
        if (filters?.module && filters.module !== 'all')
            data = data.filter(l => l.module === filters.module);
        if (filters?.severity && filters.severity !== 'all')
            data = data.filter(l => l.severity === filters.severity);
        return data;
    }
    create(data) {
        const all = this.store.readAll();
        const log = {
            id: this.store.getNextId('log', 'id', 1),
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
            user: data.user,
            action: data.action,
            module: data.module,
            severity: data.severity ?? 'info',
            details: data.details ?? '',
        };
        all.unshift(log);
        this.store.writeAll(all);
        return log;
    }
    remove(id) {
        const data = this.store.readAll();
        const idx = data.findIndex(l => l.id === id);
        if (idx === -1)
            throw new common_1.NotFoundException(`Log ${id} not found`);
        data.splice(idx, 1);
        this.store.writeAll(data);
    }
};
exports.LogsService = LogsService;
exports.LogsService = LogsService = __decorate([
    (0, common_1.Injectable)()
], LogsService);
//# sourceMappingURL=logs.service.js.map