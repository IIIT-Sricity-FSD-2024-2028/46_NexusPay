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
exports.SplitExpensesService = void 0;
const common_1 = require("@nestjs/common");
const split_expenses_repository_1 = require("./split-expenses.repository");
const users_repository_1 = require("../users/users.repository");
let SplitExpensesService = class SplitExpensesService {
    repo;
    usersRepo;
    constructor(repo, usersRepo) {
        this.repo = repo;
        this.usersRepo = usersRepo;
    }
    resolveVpa(userId) {
        const user = this.usersRepo.findById(userId);
        return user?.vpa ?? null;
    }
    findByUser(userId) {
        const vpa = this.resolveVpa(userId);
        return this.repo.findAll().filter(s => {
            const isCreator = s.createdBy === userId || (vpa != null && s.createdBy === vpa);
            const isMember = s.members.some(m => m.memberId === userId || (vpa != null && m.memberId === vpa));
            return isCreator || isMember;
        });
    }
    findAll() { return this.repo.findAll(); }
    findOne(id) {
        const split = this.repo.findById(id);
        if (!split)
            throw new common_1.NotFoundException(`Split ${id} not found`);
        return split;
    }
    create(input) {
        const userId = input.userId ?? 'john.c@nexuspay';
        const vpa = this.resolveVpa(userId);
        const split = {
            id: this.repo.nextId(),
            name: input.name,
            createdBy: vpa ?? userId,
            members: input.members ?? [],
            totalAmount: input.totalAmount ?? 0,
            settled: 0,
            date: new Date().toISOString().split('T')[0],
            status: 'pending',
            description: input.description ?? '',
        };
        return this.repo.save(split);
    }
    update(id, input) {
        const existing = this.repo.findById(id);
        if (!existing)
            throw new common_1.NotFoundException(`Split ${id} not found`);
        const members = input.members ?? existing.members;
        const settled = members.filter(m => m.paid).reduce((acc, m) => acc + m.share, 0);
        const totalAmount = input.totalAmount ?? existing.totalAmount;
        const status = settled >= totalAmount ? 'completed' : (input.status ?? existing.status);
        const updated = this.repo.update(id, { ...input, members, settled, status });
        if (!updated)
            throw new common_1.NotFoundException(`Split ${id} not found`);
        return updated;
    }
    remove(id) {
        const deleted = this.repo.deleteById(id);
        if (!deleted)
            throw new common_1.NotFoundException(`Split ${id} not found`);
    }
};
exports.SplitExpensesService = SplitExpensesService;
exports.SplitExpensesService = SplitExpensesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [split_expenses_repository_1.SplitExpensesRepository,
        users_repository_1.UsersRepository])
], SplitExpensesService);
//# sourceMappingURL=split-expenses.service.js.map