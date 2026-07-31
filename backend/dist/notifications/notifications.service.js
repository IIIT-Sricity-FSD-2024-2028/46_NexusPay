"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const json_store_1 = require("../common/json-store");
const SEED = [
    { id: 'n1', userId: 'john.c@nexuspay', message: 'Payment of ₹5,000 sent to alice.c@nexuspay', type: 'payment', read: false, date: '2 min ago' },
    { id: 'n2', userId: 'john.c@nexuspay', message: 'Received ₹2,500 from bob.c@nexuspay', type: 'received', read: false, date: '15 min ago' },
    { id: 'n3', userId: 'john.c@nexuspay', message: 'New split request from emma.c@nexuspay', type: 'split', read: false, date: '1 hour ago' },
    { id: 'n4', userId: 'john.c@nexuspay', message: 'Your scheduled payment of ₹15,000 for Rent is due tomorrow', type: 'reminder', read: true, date: '3 hours ago' },
    { id: 'n5', userId: 'john.c@nexuspay', message: 'Dispute DSP001 status updated to In Review', type: 'dispute', read: true, date: '1 day ago' },
];
let NotificationsService = class NotificationsService {
    store = new json_store_1.JsonStore('notifications.json', SEED);
    findByUser(userId) {
        return this.store.readAll().filter(n => n.userId === userId);
    }
    findAll() { return this.store.readAll(); }
    create(data) {
        const all = this.store.readAll();
        const n = {
            id: this.store.getNextId('n', 'id', 1),
            userId: data.userId,
            message: data.message,
            type: data.type,
            read: false,
            date: new Date().toISOString(),
        };
        all.unshift(n);
        this.store.writeAll(all);
        return n;
    }
    markRead(id) {
        const data = this.store.readAll();
        const n = data.find(x => x.id === id);
        if (!n)
            throw new common_1.NotFoundException(`Notification ${id} not found`);
        n.read = true;
        this.store.writeAll(data);
        return n;
    }
    markAllRead(userId) {
        const data = this.store.readAll();
        data.filter(n => n.userId === userId).forEach(n => { n.read = true; });
        this.store.writeAll(data);
    }
    clearAll(userId) {
        const filtered = this.store.readAll().filter(n => n.userId !== userId);
        this.store.writeAll(filtered);
    }
    getUnreadCount(userId) {
        return this.store.readAll().filter(n => n.userId === userId && !n.read).length;
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)()
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map