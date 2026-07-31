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
exports.TransactionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const transactions_service_1 = require("./transactions.service");
const create_transaction_dto_1 = require("./dto/create-transaction.dto");
const update_transaction_dto_1 = require("./dto/update-transaction.dto");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const notifications_service_1 = require("../notifications/notifications.service");
const logs_service_1 = require("../logs/logs.service");
const users_service_1 = require("../users/users.service");
const bank_accounts_service_1 = require("../bank-accounts/bank-accounts.service");
let TransactionsController = class TransactionsController {
    service;
    notificationsService;
    logsService;
    usersService;
    bankAccountsService;
    constructor(service, notificationsService, logsService, usersService, bankAccountsService) {
        this.service = service;
        this.notificationsService = notificationsService;
        this.logsService = logsService;
        this.usersService = usersService;
        this.bankAccountsService = bankAccountsService;
    }
    findAll(status, type, search, user) {
        if (user)
            return this.service.findByUser(user, { status, type, search });
        return this.service.findAll({ status, type, search });
    }
    getStats() { return this.service.getStats(); }
    findOne(id) { return this.service.findOne(id); }
    create(dto) {
        const txn = this.service.create(dto);
        try {
            const senderUser = this.usersService.findOne(dto.senderId);
            this.notificationsService.create({
                userId: senderUser.id,
                message: `Payment of ₹${dto.amount.toLocaleString('en-IN')} sent to ${dto.receiverId}`,
                type: 'payment',
            });
            this.usersService.incrementTxns(senderUser.id);
            if (txn.status === 'Completed') {
                this.bankAccountsService.deductBalance(senderUser.id, dto.amount);
            }
            this.tryNotifyReceiver(dto, txn.status);
            this.logsService.create({
                user: dto.senderId,
                action: 'Transaction Created',
                module: 'Transactions',
                severity: 'info',
                details: `${txn.id}: ${dto.senderId} → ${dto.receiverId} ₹${dto.amount} (${txn.status})`,
            });
        }
        catch (e) {
            const msg = e instanceof Error ? e.message : String(e);
            console.warn('Transaction side-effect error:', msg);
        }
        return txn;
    }
    tryNotifyReceiver(dto, txnStatus) {
        try {
            const receiverUser = this.usersService.findOne(dto.receiverId);
            this.notificationsService.create({
                userId: receiverUser.id,
                message: `Received ₹${dto.amount.toLocaleString('en-IN')} from ${dto.senderId}`,
                type: 'received',
            });
            this.usersService.incrementTxns(receiverUser.id);
            if (txnStatus === 'Completed') {
                this.bankAccountsService.creditBalance(receiverUser.id, dto.amount);
            }
        }
        catch (_e) {
        }
    }
    update(id, dto) {
        const txn = this.service.update(id, dto);
        try {
            if (dto.status) {
                this.logsService.create({
                    user: 'System',
                    action: 'Transaction Updated',
                    module: 'Transactions',
                    severity: dto.status === 'Failed' ? 'warning' : 'info',
                    details: `${id} status changed to ${dto.status}`,
                });
            }
        }
        catch (e) {
            const msg = e instanceof Error ? e.message : String(e);
            console.warn('Transaction update side-effect error:', msg);
        }
        return txn;
    }
    remove(id) {
        this.service.remove(id);
        try {
            this.logsService.create({
                user: 'System',
                action: 'Transaction Deleted',
                module: 'Transactions',
                severity: 'warning',
                details: `Transaction ${id} was deleted`,
            });
        }
        catch (e) {
            const msg = e instanceof Error ? e.message : String(e);
            console.warn('Transaction delete side-effect error:', msg);
        }
        return { message: `Transaction ${id} deleted` };
    }
};
exports.TransactionsController = TransactionsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all transactions with optional filters' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: ['all', 'Completed', 'Pending', 'Failed'] }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, enum: ['all', 'Transfer', 'Payment', 'Refund', 'Split', 'Scheduled'] }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'user', required: false, description: 'Filter by sender/receiver ID' }),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Array)
], TransactionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Get transaction statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], TransactionsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get transaction by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], TransactionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new transaction' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Transaction created' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_transaction_dto_1.CreateTransactionDto]),
    __metadata("design:returntype", Object)
], TransactionsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Update transaction' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_transaction_dto_1.UpdateTransactionDto]),
    __metadata("design:returntype", Object)
], TransactionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete transaction' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], TransactionsController.prototype, "remove", null);
exports.TransactionsController = TransactionsController = __decorate([
    (0, swagger_1.ApiTags)('Transactions'),
    (0, common_1.Controller)('transactions'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [transactions_service_1.TransactionsService,
        notifications_service_1.NotificationsService,
        logs_service_1.LogsService,
        users_service_1.UsersService,
        bank_accounts_service_1.BankAccountsService])
], TransactionsController);
//# sourceMappingURL=transactions.controller.js.map