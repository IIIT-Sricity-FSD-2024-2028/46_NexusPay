"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisputesService = void 0;
const common_1 = require("@nestjs/common");
const json_store_1 = require("../common/json-store");
const SEED = [
    { id: 'DSP001', txnId: 'TXN005', customerId: 'sarah.c@nexuspay', amount: 450, reason: 'Settlement amount delayed', status: 'Pending', date: '2024-03-28', raisedBy: 'sarah.c@nexuspay', assignedTo: 'admin.a@nexuspay' },
    { id: 'DSP002', txnId: 'TXN013', customerId: 'tom.c@nexuspay', amount: 520, reason: 'Wrong settlement amount received', status: 'Pending', date: '2024-03-27', raisedBy: 'tom.c@nexuspay', assignedTo: 'admin.a@nexuspay' },
    { id: 'DSP003', txnId: 'TXN009', customerId: 'alice.c@nexuspay', amount: 8900, reason: 'Settlement amount delayed', status: 'In Review', date: '2024-03-26', raisedBy: 'alice.c@nexuspay', assignedTo: 'admin.a@nexuspay' },
    { id: 'DSP004', txnId: 'TXN017', customerId: 'emma.c@nexuspay', amount: 500, reason: 'Duplicate charge', status: 'In Review', date: '2024-03-25', raisedBy: 'emma.c@nexuspay', assignedTo: 'admin.a@nexuspay' },
    { id: 'DSP005', txnId: 'TXN004', customerId: 'john.c@nexuspay', amount: 800, reason: 'Duplicate charge', status: 'Solved', date: '2024-03-24', raisedBy: 'john.c@nexuspay', assignedTo: 'admin.a@nexuspay' },
    { id: 'DSP006', txnId: 'TXN010', customerId: 'bob.c@nexuspay', amount: 1200, reason: 'Wrong settlement amount received', status: 'Solved', date: '2024-03-22', raisedBy: 'bob.c@nexuspay', assignedTo: 'admin.a@nexuspay' },
];
let DisputesService = class DisputesService {
    store = new json_store_1.JsonStore('disputes.json', SEED);
    findAll(status) {
        const data = this.store.readAll();
        if (status && status !== 'all')
            return data.filter(d => d.status === status);
        return data;
    }
    findOne(id) {
        const data = this.store.readAll();
        const d = data.find(x => x.id === id);
        if (!d)
            throw new common_1.NotFoundException(`Dispute ${id} not found`);
        return d;
    }
    findByCustomer(customerId) {
        return this.store.readAll().filter(d => d.customerId.toLowerCase().includes(customerId.toLowerCase()));
    }
    findByRaisedBy(userId) {
        return this.store.readAll().filter(d => d.raisedBy === userId);
    }
    findByAssignedTo(adminId) {
        return this.store.readAll().filter(d => d.assignedTo === adminId);
    }
    create(dto) {
        const data = this.store.readAll();
        const d = {
            id: this.store.getNextId('DSP'),
            txnId: dto.txnId,
            customerId: dto.customerId,
            amount: dto.amount,
            reason: dto.reason,
            status: 'Pending',
            date: new Date().toISOString().split('T')[0],
            description: dto.description,
            raisedBy: dto.raisedBy ?? dto.customerId,
            assignedTo: dto.assignedTo ?? 'admin.a@nexuspay',
        };
        data.unshift(d);
        this.store.writeAll(data);
        return d;
    }
    update(id, dto) {
        const data = this.store.readAll();
        const d = data.find(x => x.id === id);
        if (!d)
            throw new common_1.NotFoundException(`Dispute ${id} not found`);
        Object.assign(d, dto);
        this.store.writeAll(data);
        return d;
    }
    updateStatus(id, status) {
        const data = this.store.readAll();
        const d = data.find(x => x.id === id);
        if (!d)
            throw new common_1.NotFoundException(`Dispute ${id} not found`);
        d.status = status;
        this.store.writeAll(data);
        return d;
    }
    remove(id) {
        const data = this.store.readAll();
        const idx = data.findIndex(d => d.id === id);
        if (idx === -1)
            throw new common_1.NotFoundException(`Dispute ${id} not found`);
        data.splice(idx, 1);
        this.store.writeAll(data);
    }
    getCounts() {
        const data = this.store.readAll();
        return {
            total: data.length,
            pending: data.filter(d => d.status === 'Pending').length,
            review: data.filter(d => d.status === 'In Review').length,
            solved: data.filter(d => d.status === 'Solved').length,
        };
    }
};
exports.DisputesService = DisputesService;
exports.DisputesService = DisputesService = __decorate([
    (0, common_1.Injectable)()
], DisputesService);
//# sourceMappingURL=disputes.service.js.map