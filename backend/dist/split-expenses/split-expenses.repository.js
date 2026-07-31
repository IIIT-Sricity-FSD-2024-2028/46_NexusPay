"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplitExpensesRepository = void 0;
const common_1 = require("@nestjs/common");
const json_store_1 = require("../common/json-store");
const SEED = [
    {
        id: 'split1', name: 'Weekend Dinner', createdBy: 'john.c@nexuspay',
        members: [
            { memberId: 'alice.c@nexuspay', share: 500, paid: true },
            { memberId: 'bob.c@nexuspay', share: 500, paid: false },
            { memberId: 'emma.c@nexuspay', share: 500, paid: true },
            { memberId: 'david.c@nexuspay', share: 500, paid: false },
        ],
        totalAmount: 2000, settled: 1000, date: '2026-03-15', status: 'pending', description: 'Dinner at Taj restaurant',
    },
    {
        id: 'split2', name: 'Road Trip', createdBy: 'john.c@nexuspay',
        members: [
            { memberId: 'sarah.c@nexuspay', share: 2500, paid: true },
            { memberId: 'tom.c@nexuspay', share: 2500, paid: true },
            { memberId: 'priya.c@nexuspay', share: 2500, paid: false },
        ],
        totalAmount: 7500, settled: 5000, date: '2026-03-10', status: 'pending', description: 'Fuel + snacks',
    },
    {
        id: 'split3', name: 'OTT Subscriptions', createdBy: 'john.c@nexuspay',
        members: [
            { memberId: 'raj.c@nexuspay', share: 200, paid: true },
            { memberId: 'bob.c@nexuspay', share: 200, paid: true },
        ],
        totalAmount: 400, settled: 400, date: '2026-02-28', status: 'completed', description: 'Netflix + Spotify shared',
    },
];
let SplitExpensesRepository = class SplitExpensesRepository {
    store = new json_store_1.JsonStore('split-expenses.json', SEED);
    findAll() { return this.store.readAll(); }
    findByUserId(userId) {
        return this.store.readAll().filter(s => s.createdBy === userId || s.members.some(m => m.memberId === userId));
    }
    findById(id) { return this.store.readAll().find(s => s.id === id); }
    nextId() { return this.store.getNextId('split', 'id', 1); }
    save(split) {
        const data = this.store.readAll();
        data.unshift(split);
        this.store.writeAll(data);
        return split;
    }
    update(id, partial) {
        const data = this.store.readAll();
        const record = data.find(s => s.id === id);
        if (!record)
            return undefined;
        Object.assign(record, partial);
        this.store.writeAll(data);
        return record;
    }
    deleteById(id) {
        const data = this.store.readAll();
        const idx = data.findIndex(s => s.id === id);
        if (idx === -1)
            return false;
        data.splice(idx, 1);
        this.store.writeAll(data);
        return true;
    }
};
exports.SplitExpensesRepository = SplitExpensesRepository;
exports.SplitExpensesRepository = SplitExpensesRepository = __decorate([
    (0, common_1.Injectable)()
], SplitExpensesRepository);
//# sourceMappingURL=split-expenses.repository.js.map