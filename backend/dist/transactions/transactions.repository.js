"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsRepository = void 0;
const common_1 = require("@nestjs/common");
const json_store_1 = require("../common/json-store");
const SEED = [
    { id: 'TXN001', senderId: 'john.c@nexuspay', receiverId: 'alice.c@nexuspay', amount: 5000, type: 'Transfer', status: 'Completed', category: 'Friends & Family', date: '2026-03-11 10:30 AM' },
    { id: 'TXN002', senderId: 'bob.c@nexuspay', receiverId: 'amazon.m@nexuspay', amount: 2500, type: 'Payment', status: 'Completed', category: 'Shopping', date: '2026-03-11 09:15 AM' },
    { id: 'TXN003', senderId: 'emma.c@nexuspay', receiverId: 'david.c@nexuspay', amount: 8000, type: 'Transfer', status: 'Pending', category: 'Friends & Family', date: '2026-03-10 05:45 PM' },
    { id: 'TXN004', senderId: 'sarah.c@nexuspay', receiverId: 'swiggy.m@nexuspay', amount: 1200, type: 'Payment', status: 'Completed', category: 'Food & Dining', date: '2026-03-10 02:30 PM' },
    { id: 'TXN005', senderId: 'tom.c@nexuspay', receiverId: 'flipkart.m@nexuspay', amount: 3500, type: 'Payment', status: 'Failed', category: 'Shopping', date: '2026-03-10 11:20 AM' },
    { id: 'TXN006', senderId: 'priya.c@nexuspay', receiverId: 'raj.c@nexuspay', amount: 6500, type: 'Transfer', status: 'Completed', category: 'Friends & Family', date: '2026-03-09 04:15 PM' },
    { id: 'TXN007', senderId: 'john.c@nexuspay', receiverId: 'alice.c@nexuspay', amount: 2500, type: 'Transfer', status: 'Completed', category: 'Friends & Family', date: '2026-03-09 02:30 PM' },
    { id: 'TXN008', senderId: 'bob.c@nexuspay', receiverId: 'amazon.m@nexuspay', amount: 1200, type: 'Payment', status: 'Completed', category: 'Shopping', date: '2026-03-09 01:15 PM' },
    { id: 'TXN009', senderId: 'emma.c@nexuspay', receiverId: 'david.c@nexuspay', amount: 5000, type: 'Transfer', status: 'Pending', category: 'Friends & Family', date: '2026-03-08 12:45 PM' },
    { id: 'TXN010', senderId: 'alice.c@nexuspay', receiverId: 'netflix.m@nexuspay', amount: 499, type: 'Scheduled', status: 'Completed', category: 'Entertainment', date: '2026-03-08 11:20 AM' },
    { id: 'TXN011', senderId: 'sarah.c@nexuspay', receiverId: 'zomato.m@nexuspay', amount: 450, type: 'Payment', status: 'Failed', category: 'Food & Dining', date: '2026-03-08 10:55 AM' },
    { id: 'TXN012', senderId: 'tom.c@nexuspay', receiverId: 'uber.m@nexuspay', amount: 3200, type: 'Payment', status: 'Completed', category: 'Travel', date: '2026-03-07 10:10 PM' },
    { id: 'TXN013', senderId: 'priya.c@nexuspay', receiverId: 'raj.c@nexuspay', amount: 15000, type: 'Transfer', status: 'Completed', category: 'Friends & Family', date: '2026-03-07 07:45 PM' },
    { id: 'TXN014', senderId: 'john.c@nexuspay', receiverId: 'netflix.m@nexuspay', amount: 649, type: 'Payment', status: 'Completed', category: 'Entertainment', date: '2026-03-07 06:30 PM' },
    { id: 'TXN015', senderId: 'alice.c@nexuspay', receiverId: 'myntra.m@nexuspay', amount: 8900, type: 'Payment', status: 'Pending', category: 'Shopping', date: '2026-03-07 04:20 PM' },
    { id: 'TXN016', senderId: 'bob.c@nexuspay', receiverId: 'emma.c@nexuspay', amount: 1200, type: 'Refund', status: 'Completed', category: 'Refunds', date: '2026-03-07 03:10 PM' },
    { id: 'TXN017', senderId: 'emma.c@nexuspay', receiverId: 'jio.m@nexuspay', amount: 380, type: 'Payment', status: 'Completed', category: 'Utilities', date: '2026-03-06 02:00 PM' },
    { id: 'TXN018', senderId: 'david.c@nexuspay', receiverId: 'sarah.c@nexuspay', amount: 6000, type: 'Transfer', status: 'Completed', category: 'Friends & Family', date: '2026-03-06 12:30 PM' },
    { id: 'TXN019', senderId: 'tom.c@nexuspay', receiverId: 'MERCH009', amount: 520, type: 'Payment', status: 'Failed', category: 'Food & Dining', date: '2026-03-06 11:15 AM' },
    { id: 'TXN020', senderId: 'priya.c@nexuspay', receiverId: 'MERCH010', amount: 2100, type: 'Payment', status: 'Pending', category: 'Utilities', date: '2026-03-05 08:45 PM' },
    { id: 'TXN021', senderId: 'john.c@nexuspay', receiverId: 'swiggy.m@nexuspay', amount: 850, type: 'Split', status: 'Completed', category: 'Food & Dining', date: '2026-03-05 07:30 PM' },
    { id: 'TXN022', senderId: 'alice.c@nexuspay', receiverId: 'john.c@nexuspay', amount: 3000, type: 'Transfer', status: 'Completed', category: 'Friends & Family', date: '2026-03-05 06:00 PM' },
    { id: 'TXN023', senderId: 'bob.c@nexuspay', receiverId: 'flipkart.m@nexuspay', amount: 4200, type: 'Split', status: 'Completed', category: 'Shopping', date: '2026-03-05 04:45 PM' },
    { id: 'TXN024', senderId: 'david.c@nexuspay', receiverId: 'amazon.m@nexuspay', amount: 1800, type: 'Scheduled', status: 'Completed', category: 'Shopping', date: '2026-03-05 03:15 PM' },
    { id: 'TXN025', senderId: 'sarah.c@nexuspay', receiverId: 'bob.c@nexuspay', amount: 2200, type: 'Split', status: 'Pending', category: 'Entertainment', date: '2026-03-05 01:30 PM' },
    { id: 'TXN026', senderId: 'john.c@nexuspay', receiverId: 'zomato.m@nexuspay', amount: 1350, type: 'Scheduled', status: 'Completed', category: 'Food & Dining', date: '2026-03-04 09:00 PM' },
    { id: 'TXN027', senderId: 'raj.c@nexuspay', receiverId: 'john.c@nexuspay', amount: 7500, type: 'Transfer', status: 'Completed', category: 'Friends & Family', date: '2026-03-04 07:20 PM' },
    { id: 'TXN028', senderId: 'emma.c@nexuspay', receiverId: 'uber.m@nexuspay', amount: 920, type: 'Scheduled', status: 'Completed', category: 'Travel', date: '2026-03-04 05:10 PM' },
    { id: 'TXN029', senderId: 'tom.c@nexuspay', receiverId: 'priya.c@nexuspay', amount: 4500, type: 'Split', status: 'Completed', category: 'Entertainment', date: '2026-03-04 03:40 PM' },
    { id: 'TXN030', senderId: 'john.c@nexuspay', receiverId: 'myntra.m@nexuspay', amount: 2999, type: 'Payment', status: 'Failed', category: 'Shopping', date: '2026-03-04 02:00 PM' },
    { id: 'TXN031', senderId: 'alice.c@nexuspay', receiverId: 'swiggy.m@nexuspay', amount: 560, type: 'Scheduled', status: 'Completed', category: 'Food & Dining', date: '2026-03-04 12:15 PM' },
    { id: 'TXN032', senderId: 'bob.c@nexuspay', receiverId: 'sarah.c@nexuspay', amount: 1750, type: 'Split', status: 'Completed', category: 'Entertainment', date: '2026-03-04 10:30 AM' },
    { id: 'TXN033', senderId: 'david.c@nexuspay', receiverId: 'jio.m@nexuspay', amount: 299, type: 'Scheduled', status: 'Pending', category: 'Utilities', date: '2026-03-03 08:45 PM' },
    { id: 'TXN034', senderId: 'priya.c@nexuspay', receiverId: 'bob.c@nexuspay', amount: 3300, type: 'Split', status: 'Completed', category: 'Food & Dining', date: '2026-03-03 06:30 PM' },
    { id: 'TXN035', senderId: 'sarah.c@nexuspay', receiverId: 'amazon.m@nexuspay', amount: 7800, type: 'Payment', status: 'Completed', category: 'Shopping', date: '2026-03-03 04:20 PM' },
    { id: 'TXN036', senderId: 'emma.c@nexuspay', receiverId: 'john.c@nexuspay', amount: 1500, type: 'Refund', status: 'Completed', category: 'Refunds', date: '2026-03-03 02:45 PM' },
    { id: 'TXN037', senderId: 'raj.c@nexuspay', receiverId: 'flipkart.m@nexuspay', amount: 4100, type: 'Split', status: 'Failed', category: 'Shopping', date: '2026-03-03 01:00 PM' },
    { id: 'TXN038', senderId: 'alice.c@nexuspay', receiverId: 'david.c@nexuspay', amount: 2800, type: 'Transfer', status: 'Completed', category: 'Friends & Family', date: '2026-03-03 11:30 AM' },
    { id: 'TXN039', senderId: 'tom.c@nexuspay', receiverId: 'netflix.m@nexuspay', amount: 199, type: 'Scheduled', status: 'Completed', category: 'Entertainment', date: '2026-03-03 10:00 AM' },
    { id: 'TXN040', senderId: 'john.c@nexuspay', receiverId: 'bob.c@nexuspay', amount: 4000, type: 'Split', status: 'Completed', category: 'Food & Dining', date: '2026-03-02 08:15 PM' },
    { id: 'TXN041', senderId: 'david.c@nexuspay', receiverId: 'raj.c@nexuspay', amount: 5500, type: 'Transfer', status: 'Completed', category: 'Friends & Family', date: '2026-03-02 06:00 PM' },
    { id: 'TXN042', senderId: 'bob.c@nexuspay', receiverId: 'zomato.m@nexuspay', amount: 680, type: 'Payment', status: 'Completed', category: 'Food & Dining', date: '2026-03-02 04:30 PM' },
    { id: 'TXN043', senderId: 'priya.c@nexuspay', receiverId: 'myntra.m@nexuspay', amount: 3400, type: 'Scheduled', status: 'Completed', category: 'Shopping', date: '2026-03-02 02:00 PM' },
    { id: 'TXN044', senderId: 'sarah.c@nexuspay', receiverId: 'alice.c@nexuspay', amount: 1900, type: 'Split', status: 'Pending', category: 'Entertainment', date: '2026-03-02 12:45 PM' },
    { id: 'TXN045', senderId: 'emma.c@nexuspay', receiverId: 'swiggy.m@nexuspay', amount: 750, type: 'Payment', status: 'Completed', category: 'Food & Dining', date: '2026-03-01 10:30 PM' },
    { id: 'TXN046', senderId: 'raj.c@nexuspay', receiverId: 'uber.m@nexuspay', amount: 2600, type: 'Scheduled', status: 'Completed', category: 'Travel', date: '2026-03-01 08:15 PM' },
    { id: 'TXN047', senderId: 'alice.c@nexuspay', receiverId: 'emma.c@nexuspay', amount: 1100, type: 'Split', status: 'Completed', category: 'Food & Dining', date: '2026-03-01 06:00 PM' },
    { id: 'TXN048', senderId: 'tom.c@nexuspay', receiverId: 'amazon.m@nexuspay', amount: 5200, type: 'Payment', status: 'Completed', category: 'Shopping', date: '2026-03-01 03:30 PM' },
    { id: 'TXN049', senderId: 'david.c@nexuspay', receiverId: 'jio.m@nexuspay', amount: 399, type: 'Scheduled', status: 'Completed', category: 'Utilities', date: '2026-03-01 01:00 PM' },
    { id: 'TXN050', senderId: 'priya.c@nexuspay', receiverId: 'sarah.c@nexuspay', amount: 9200, type: 'Transfer', status: 'Completed', category: 'Friends & Family', date: '2026-03-01 11:00 AM' },
];
let TransactionsRepository = class TransactionsRepository {
    store = new json_store_1.JsonStore('transactions.json', SEED);
    findAll() { return this.store.readAll(); }
    findById(id) { return this.store.readAll().find(t => t.id === id); }
    nextId() { return this.store.getNextId('TXN'); }
    save(transaction) {
        const data = this.store.readAll();
        data.unshift(transaction);
        this.store.writeAll(data);
        return transaction;
    }
    update(id, partial) {
        const data = this.store.readAll();
        const record = data.find(t => t.id === id);
        if (!record)
            return undefined;
        Object.assign(record, partial);
        this.store.writeAll(data);
        return record;
    }
    deleteById(id) {
        const data = this.store.readAll();
        const idx = data.findIndex(t => t.id === id);
        if (idx === -1)
            return false;
        data.splice(idx, 1);
        this.store.writeAll(data);
        return true;
    }
};
exports.TransactionsRepository = TransactionsRepository;
exports.TransactionsRepository = TransactionsRepository = __decorate([
    (0, common_1.Injectable)()
], TransactionsRepository);
//# sourceMappingURL=transactions.repository.js.map