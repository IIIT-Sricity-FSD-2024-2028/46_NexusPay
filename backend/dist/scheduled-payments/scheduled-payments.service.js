"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduledPaymentsService = void 0;
const common_1 = require("@nestjs/common");
const json_store_1 = require("../common/json-store");
const SEED = [
    { id: 'sp1', userId: 'john.c@nexuspay', title: 'Rent Payment', receiverId: 'amazon.m@nexuspay', amount: 15000, frequency: 'monthly', nextPayment: '2026-04-01', status: 'active', type: 'outgoing' },
    { id: 'sp2', userId: 'john.c@nexuspay', title: 'Electricity Bill', receiverId: 'swiggy.m@nexuspay', amount: 2400, frequency: 'monthly', nextPayment: '2026-04-05', status: 'active', type: 'outgoing' },
    { id: 'sp3', userId: 'john.c@nexuspay', title: 'Netflix Subscription', receiverId: 'flipkart.m@nexuspay', amount: 649, frequency: 'monthly', nextPayment: '2026-04-07', status: 'active', type: 'outgoing' },
];
let ScheduledPaymentsService = class ScheduledPaymentsService {
    store = new json_store_1.JsonStore('scheduled-payments.json', SEED);
    findByUser(userId) {
        return this.store.readAll().filter(s => s.userId === userId);
    }
    findAll() { return this.store.readAll(); }
    findOne(id) {
        const data = this.store.readAll();
        const s = data.find(x => x.id === id);
        if (!s)
            throw new common_1.NotFoundException(`Schedule ${id} not found`);
        return s;
    }
    create(dto) {
        const data = this.store.readAll();
        const s = {
            id: this.store.getNextId('sp', 'id', 1),
            userId: dto.userId ?? 'john.c@nexuspay',
            title: dto.title,
            receiverId: dto.receiverId,
            amount: dto.amount,
            frequency: dto.frequency,
            nextPayment: dto.nextPayment,
            status: 'active',
            type: 'outgoing',
        };
        data.push(s);
        this.store.writeAll(data);
        return s;
    }
    update(id, dto) {
        const data = this.store.readAll();
        const s = data.find(x => x.id === id);
        if (!s)
            throw new common_1.NotFoundException(`Schedule ${id} not found`);
        Object.assign(s, dto);
        this.store.writeAll(data);
        return s;
    }
    remove(id) {
        const data = this.store.readAll();
        const idx = data.findIndex(s => s.id === id);
        if (idx === -1)
            throw new common_1.NotFoundException(`Schedule ${id} not found`);
        data.splice(idx, 1);
        this.store.writeAll(data);
    }
};
exports.ScheduledPaymentsService = ScheduledPaymentsService;
exports.ScheduledPaymentsService = ScheduledPaymentsService = __decorate([
    (0, common_1.Injectable)()
], ScheduledPaymentsService);
//# sourceMappingURL=scheduled-payments.service.js.map