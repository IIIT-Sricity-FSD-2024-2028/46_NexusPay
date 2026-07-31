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
exports.BeneficiariesService = void 0;
const common_1 = require("@nestjs/common");
const beneficiaries_repository_1 = require("./beneficiaries.repository");
const users_repository_1 = require("../users/users.repository");
let BeneficiariesService = class BeneficiariesService {
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
        const all = this.repo.findAll();
        return all.filter(b => b.userId === userId || (vpa != null && b.userId === vpa));
    }
    findAll() { return this.repo.findAll(); }
    create(data) {
        const vpa = this.resolveVpa(data.userId);
        const beneficiary = {
            id: this.repo.nextId(),
            userId: vpa ?? data.userId,
            name: data.name,
            beneficiaryId: data.beneficiaryId,
        };
        return this.repo.save(beneficiary);
    }
    remove(id) {
        const deleted = this.repo.deleteById(id);
        if (!deleted)
            throw new common_1.NotFoundException(`Beneficiary ${id} not found`);
    }
};
exports.BeneficiariesService = BeneficiariesService;
exports.BeneficiariesService = BeneficiariesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [beneficiaries_repository_1.BeneficiariesRepository,
        users_repository_1.UsersRepository])
], BeneficiariesService);
//# sourceMappingURL=beneficiaries.service.js.map