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
exports.ScheduledPaymentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const scheduled_payments_service_1 = require("./scheduled-payments.service");
const create_scheduled_payment_dto_1 = require("./dto/create-scheduled-payment.dto");
const update_scheduled_payment_dto_1 = require("./dto/update-scheduled-payment.dto");
const roles_guard_1 = require("../common/guards/roles.guard");
let ScheduledPaymentsController = class ScheduledPaymentsController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll(userId) {
        if (userId)
            return this.service.findByUser(userId);
        return this.service.findAll();
    }
    findOne(id) { return this.service.findOne(id); }
    create(dto) { return this.service.create(dto); }
    update(id, dto) {
        return this.service.update(id, dto);
    }
    remove(id) {
        this.service.remove(id);
        return { message: 'Schedule deleted' };
    }
};
exports.ScheduledPaymentsController = ScheduledPaymentsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List scheduled payments' }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false, type: String }),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Array)
], ScheduledPaymentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get schedule by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], ScheduledPaymentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create schedule' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_scheduled_payment_dto_1.CreateScheduledPaymentDto]),
    __metadata("design:returntype", Object)
], ScheduledPaymentsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update schedule' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_scheduled_payment_dto_1.UpdateScheduledPaymentDto]),
    __metadata("design:returntype", Object)
], ScheduledPaymentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete schedule' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], ScheduledPaymentsController.prototype, "remove", null);
exports.ScheduledPaymentsController = ScheduledPaymentsController = __decorate([
    (0, swagger_1.ApiTags)('Scheduled Payments'),
    (0, common_1.Controller)('scheduled-payments'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [scheduled_payments_service_1.ScheduledPaymentsService])
], ScheduledPaymentsController);
//# sourceMappingURL=scheduled-payments.controller.js.map