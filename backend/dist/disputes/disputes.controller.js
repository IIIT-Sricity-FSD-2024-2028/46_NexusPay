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
exports.DisputesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const disputes_service_1 = require("./disputes.service");
const create_dispute_dto_1 = require("./dto/create-dispute.dto");
const update_dispute_dto_1 = require("./dto/update-dispute.dto");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const notifications_service_1 = require("../notifications/notifications.service");
const logs_service_1 = require("../logs/logs.service");
let DisputesController = class DisputesController {
    service;
    notificationsService;
    logsService;
    constructor(service, notificationsService, logsService) {
        this.service = service;
        this.notificationsService = notificationsService;
        this.logsService = logsService;
    }
    findAll(status, customer, raisedBy, assignedTo) {
        if (raisedBy)
            return this.service.findByRaisedBy(raisedBy);
        if (assignedTo)
            return this.service.findByAssignedTo(assignedTo);
        if (customer)
            return this.service.findByCustomer(customer);
        return this.service.findAll(status);
    }
    getCounts() { return this.service.getCounts(); }
    findOne(id) { return this.service.findOne(id); }
    create(dto) {
        const dispute = this.service.create(dto);
        try {
            this.notificationsService.create({
                userId: dto.customerId,
                message: `Dispute ${dispute.id} filed for ₹${dto.amount}`,
                type: 'dispute',
            });
            this.logsService.create({
                user: dto.customerId,
                action: 'Dispute Created',
                module: 'Disputes',
                severity: 'info',
                details: `${dispute.id}: ${dto.customerId} — ₹${dto.amount} (${dto.reason})`,
            });
        }
        catch (e) {
            const msg = e instanceof Error ? e.message : String(e);
            console.warn('Dispute side-effect error:', msg);
        }
        return dispute;
    }
    update(id, dto) {
        const dispute = this.service.update(id, dto);
        try {
            const updatedStatus = dto.status;
            if (updatedStatus) {
                this.notificationsService.create({
                    userId: dispute.customerId,
                    message: `Dispute ${id} status updated to ${updatedStatus}`,
                    type: 'dispute',
                });
                this.logsService.create({
                    user: 'Admin',
                    action: 'Dispute Updated',
                    module: 'Disputes',
                    severity: 'info',
                    details: `${id} status changed to ${updatedStatus}`,
                });
            }
        }
        catch (e) {
            const msg = e instanceof Error ? e.message : String(e);
            console.warn('Dispute update side-effect error:', msg);
        }
        return dispute;
    }
    updateStatus(id, status) {
        const dispute = this.service.updateStatus(id, status);
        try {
            this.notificationsService.create({
                userId: dispute.customerId,
                message: `Dispute ${id} status updated to ${status}`,
                type: 'dispute',
            });
            this.logsService.create({
                user: 'Admin',
                action: 'Dispute Status Changed',
                module: 'Disputes',
                severity: 'info',
                details: `${id} moved to ${status}`,
            });
        }
        catch (e) {
            const msg = e instanceof Error ? e.message : String(e);
            console.warn('Dispute status side-effect error:', msg);
        }
        return dispute;
    }
    remove(id) {
        this.service.remove(id);
        try {
            this.logsService.create({
                user: 'System',
                action: 'Dispute Deleted',
                module: 'Disputes',
                severity: 'warning',
                details: `Dispute ${id} was deleted`,
            });
        }
        catch (e) {
            const msg = e instanceof Error ? e.message : String(e);
            console.warn('Dispute delete side-effect error:', msg);
        }
        return { message: `Dispute ${id} deleted` };
    }
};
exports.DisputesController = DisputesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List disputes' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'customer', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'raisedBy', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'assignedTo', required: false }),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('customer')),
    __param(2, (0, common_1.Query)('raisedBy')),
    __param(3, (0, common_1.Query)('assignedTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Array)
], DisputesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('counts'),
    (0, swagger_1.ApiOperation)({ summary: 'Get dispute counts by status' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], DisputesController.prototype, "getCounts", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get dispute by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], DisputesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Raise a new dispute' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_dispute_dto_1.CreateDisputeDto]),
    __metadata("design:returntype", Object)
], DisputesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Update dispute' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_dispute_dto_1.UpdateDisputeDto]),
    __metadata("design:returntype", Object)
], DisputesController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Update dispute status' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Object)
], DisputesController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete dispute' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], DisputesController.prototype, "remove", null);
exports.DisputesController = DisputesController = __decorate([
    (0, swagger_1.ApiTags)('Disputes'),
    (0, common_1.Controller)('disputes'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [disputes_service_1.DisputesService,
        notifications_service_1.NotificationsService,
        logs_service_1.LogsService])
], DisputesController);
//# sourceMappingURL=disputes.controller.js.map