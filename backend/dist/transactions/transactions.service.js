"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const transactions_repository_1 = require("./transactions.repository");
const users_repository_1 = require("../users/users.repository");
let TransactionsService = class TransactionsService {
    repo;
    usersRepo;
    constructor(repo, usersRepo) {
        this.repo = repo;
        this.usersRepo = usersRepo;
    }
    findAll(filters) {
        let data = this.repo.findAll();
        if (filters?.status && filters.status !== 'all') {
            const s = filters.status.toLowerCase();
            data = data.filter(t => t.status.toLowerCase() === s);
        }
        if (filters?.type && filters.type !== 'all') {
            data = data.filter(t => t.type === filters.type);
        }
        if (filters?.search) {
            const q = filters.search.toLowerCase();
            data = data.filter(t => t.id.toLowerCase().includes(q) ||
                t.senderId.toLowerCase().includes(q) ||
                t.receiverId.toLowerCase().includes(q));
        }
        return data;
    }
    findOne(id) {
        const txn = this.repo.findById(id);
        if (!txn)
            throw new common_1.NotFoundException(`Transaction ${id} not found`);
        return txn;
    }
    findByUser(userId, filters) {
        const userRecord = this.usersRepo.findById(userId);
        const vpa = userRecord?.vpa;
        let data = this.repo.findAll();
        data = data.filter(t => {
            const sId = t.senderId.toLowerCase();
            const rId = t.receiverId.toLowerCase();
            const q = userId.toLowerCase();
            return (sId === q ||
                rId === q ||
                (vpa != null && (sId === vpa.toLowerCase() || rId === vpa.toLowerCase())));
        });
        if (filters?.status && filters.status !== 'all') {
            const s = filters.status.toLowerCase();
            data = data.filter(t => t.status.toLowerCase() === s);
        }
        if (filters?.type && filters.type !== 'all') {
            data = data.filter(t => t.type === filters.type);
        }
        if (filters?.search) {
            const sq = filters.search.toLowerCase();
            data = data.filter(t => t.id.toLowerCase().includes(sq) ||
                t.senderId.toLowerCase().includes(sq) ||
                t.receiverId.toLowerCase().includes(sq));
        }
        return data;
    }
    create(dto) {
        const txn = {
            id: this.repo.nextId(),
            senderId: dto.senderId,
            receiverId: dto.receiverId,
            amount: dto.amount,
            type: dto.type,
            category: dto.category ?? 'General',
            status: dto.status ?? 'Completed',
            date: new Date().toLocaleString('en-IN', {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', hour12: true,
            }),
        };
        return this.repo.save(txn);
    }
    update(id, dto) {
        const updated = this.repo.update(id, dto);
        if (!updated)
            throw new common_1.NotFoundException(`Transaction ${id} not found`);
        return updated;
    }
    remove(id) {
        const deleted = this.repo.deleteById(id);
        if (!deleted)
            throw new common_1.NotFoundException(`Transaction ${id} not found`);
    }
    getStats() {
        const data = this.repo.findAll();
        return {
            total: data.length,
            completed: data.filter(t => t.status === 'Completed').length,
            pending: data.filter(t => t.status === 'Pending').length,
            failed: data.filter(t => t.status === 'Failed').length,
            totalAmount: data.reduce((s, t) => s + t.amount, 0),
        };
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [transactions_repository_1.TransactionsRepository,
        users_repository_1.UsersRepository])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map