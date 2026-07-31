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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const users_repository_1 = require("./users.repository");
let UsersService = class UsersService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    findAll(role) {
        const data = this.repo.findAll();
        if (role)
            return data.filter(u => u.role === role);
        return data;
    }
    findOne(id) {
        const user = this.repo.findById(id);
        if (!user)
            throw new common_1.NotFoundException(`User #${id} not found`);
        return user;
    }
    findByEmail(email) {
        return this.repo.findByEmail(email);
    }
    create(dto, password) {
        const user = {
            id: this.repo.nextId(dto.role),
            email: dto.email,
            password,
            role: dto.role,
            status: dto.status ?? 'Active',
            joined: new Date().toISOString().split('T')[0],
            txns: 0,
        };
        return this.repo.save(user);
    }
    update(id, dto) {
        const updated = this.repo.update(id, dto);
        if (!updated)
            throw new common_1.NotFoundException(`User #${id} not found`);
        return updated;
    }
    updateStatus(id, status) {
        const updated = this.repo.update(id, { status });
        if (!updated)
            throw new common_1.NotFoundException(`User #${id} not found`);
        return updated;
    }
    incrementTxns(id) {
        const user = this.repo.findById(id);
        if (user) {
            this.repo.update(id, { txns: (user.txns ?? 0) + 1 });
        }
    }
    remove(id) {
        const deleted = this.repo.deleteById(id);
        if (!deleted)
            throw new common_1.NotFoundException(`User #${id} not found`);
    }
    getCustomers() { return this.repo.findAll().filter(u => u.role === 'customer'); }
    getMerchants() { return this.repo.findAll().filter(u => u.role === 'merchant'); }
    getAdmins() { return this.repo.findAll().filter(u => u.role === 'admin' || u.role === 'superuser'); }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository])
], UsersService);
//# sourceMappingURL=users.service.js.map