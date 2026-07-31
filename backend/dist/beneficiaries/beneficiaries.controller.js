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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeneficiariesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const beneficiaries_service_1 = require("./beneficiaries.service");
const roles_guard_1 = require("../common/guards/roles.guard");
let BeneficiariesController = class BeneficiariesController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll(userId) {
        if (userId)
            return this.service.findByUser(userId);
        return this.service.findAll();
    }
    create(body) { return this.service.create(body); }
    remove(id) {
        this.service.remove(id);
        return { message: 'Beneficiary removed' };
    }
};
exports.BeneficiariesController = BeneficiariesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List beneficiaries' }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false, type: String }),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Array)
], BeneficiariesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add beneficiary' }),
    (0, swagger_1.ApiBody)({ schema: { properties: { userId: { type: 'string' }, name: { type: 'string' }, beneficiaryId: { type: 'string' } } } }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], BeneficiariesController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove beneficiary' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], BeneficiariesController.prototype, "remove", null);
exports.BeneficiariesController = BeneficiariesController = __decorate([
    (0, swagger_1.ApiTags)('Beneficiaries'),
    (0, common_1.Controller)('beneficiaries'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [beneficiaries_service_1.BeneficiariesService])
], BeneficiariesController);
//# sourceMappingURL=beneficiaries.controller.js.map