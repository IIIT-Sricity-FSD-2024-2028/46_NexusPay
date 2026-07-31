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
exports.BankAccountsService = void 0;
const common_1 = require("@nestjs/common");
const bank_accounts_repository_1 = require("./bank-accounts.repository");
let BankAccountsService = class BankAccountsService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    findByUser(userId) { return this.repo.findByUser(userId); }
    findAll() { return this.repo.findAll(); }
    findOne(id) {
        const a = this.repo.findById(id);
        if (!a)
            throw new common_1.NotFoundException(`Bank account ${id} not found`);
        return a;
    }
    create(dto) {
        const account = {
            id: this.repo.nextId(),
            userId: dto.userId ?? 'john.c@nexuspay',
            bankName: dto.bankName,
            holderName: dto.holderName,
            accountNum: dto.accountNum.slice(-4),
            ifsc: dto.ifsc,
            balance: dto.balance ?? 0,
            primary: dto.primary ?? false,
        };
        return this.repo.save(account);
    }
    update(id, dto) {
        if (dto.primary) {
            const existing = this.repo.findById(id);
            if (existing)
                this.repo.clearPrimary(existing.userId);
        }
        const updated = this.repo.update(id, dto);
        if (!updated)
            throw new common_1.NotFoundException(`Bank account ${id} not found`);
        return updated;
    }
    deductBalance(userId, amount) { this.repo.deductBalance(userId, amount); }
    creditBalance(userId, amount) { this.repo.creditBalance(userId, amount); }
    remove(id) {
        const deleted = this.repo.deleteById(id);
        if (!deleted)
            throw new common_1.NotFoundException(`Bank account ${id} not found`);
    }
};
exports.BankAccountsService = BankAccountsService;
exports.BankAccountsService = BankAccountsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [bank_accounts_repository_1.BankAccountsRepository])
], BankAccountsService);
//# sourceMappingURL=bank-accounts.service.js.map