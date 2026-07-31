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
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const analytics_service_1 = require("./analytics.service");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
let AnalyticsController = class AnalyticsController {
    service;
    constructor(service) {
        this.service = service;
    }
    getDashboard() { return this.service.getDashboardStats(); }
    getRevenue() { return this.service.getRevenueData(); }
    getSpending(userId) {
        return this.service.getSpendingBreakdown(userId);
    }
    getCategoryPerformance() { return this.service.getCategoryPerformance(); }
    getTrends() { return this.service.getTransactionTrends(); }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Get dashboard statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], AnalyticsController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('revenue'),
    (0, roles_decorator_1.Roles)('admin', 'merchant', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Get revenue data' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], AnalyticsController.prototype, "getRevenue", null);
__decorate([
    (0, common_1.Get)('spending'),
    (0, swagger_1.ApiOperation)({ summary: 'Get spending breakdown' }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false, type: String }),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], AnalyticsController.prototype, "getSpending", null);
__decorate([
    (0, common_1.Get)('categories'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Get category performance' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], AnalyticsController.prototype, "getCategoryPerformance", null);
__decorate([
    (0, common_1.Get)('trends'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Get transaction trends' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], AnalyticsController.prototype, "getTrends", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('Analytics'),
    (0, common_1.Controller)('analytics'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map