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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const transactions_service_1 = require("../transactions/transactions.service");
const users_service_1 = require("../users/users.service");
const disputes_service_1 = require("../disputes/disputes.service");
let AnalyticsService = class AnalyticsService {
    txnService;
    usersService;
    disputesService;
    constructor(txnService, usersService, disputesService) {
        this.txnService = txnService;
        this.usersService = usersService;
        this.disputesService = disputesService;
    }
    getDashboardStats() {
        const txnStats = this.txnService.getStats();
        const users = this.usersService.findAll();
        const disputeCounts = this.disputesService.getCounts();
        return {
            totalUsers: users.length,
            totalCustomers: users.filter(u => u.role === 'customer').length,
            totalMerchants: users.filter(u => u.role === 'merchant').length,
            activeUsers: users.filter(u => u.status === 'Active').length,
            ...txnStats,
            disputes: disputeCounts,
        };
    }
    getRevenueData() {
        return {
            monthly: [
                { month: 'Jan', revenue: 125000, transactions: 1240 },
                { month: 'Feb', revenue: 148000, transactions: 1380 },
                { month: 'Mar', revenue: 162000, transactions: 1520 },
                { month: 'Apr', revenue: 175000, transactions: 1650 },
                { month: 'May', revenue: 189000, transactions: 1780 },
                { month: 'Jun', revenue: 195000, transactions: 1820 },
            ],
            totalRevenue: '₹9,94,000',
            growthRate: '+12.5%',
        };
    }
    getSpendingBreakdown(_userId) {
        return {
            categories: [
                { name: 'Food & Dining', amount: 12500, percentage: 30, color: '#FF6384' },
                { name: 'Shopping', amount: 8400, percentage: 20, color: '#36A2EB' },
                { name: 'Bills & Utilities', amount: 6300, percentage: 15, color: '#FFCE56' },
                { name: 'Transport', amount: 4200, percentage: 10, color: '#4BC0C0' },
                { name: 'Entertainment', amount: 3150, percentage: 7.5, color: '#9966FF' },
                { name: 'Others', amount: 7350, percentage: 17.5, color: '#FF9F40' },
            ],
            totalSpent: 41900,
            monthlyAverage: 6983,
        };
    }
    getCategoryPerformance() {
        return [
            { category: 'E-commerce', merchants: 3, volume: '₹83,00,000', growth: '+23%' },
            { category: 'Food Delivery', merchants: 2, volume: '₹30,80,000', growth: '+15%' },
            { category: 'Transport', merchants: 1, volume: '₹8,90,000', growth: '+8%' },
            { category: 'Entertainment', merchants: 1, volume: '₹5,60,000', growth: '-3%' },
            { category: 'Fashion', merchants: 1, volume: '₹15,20,000', growth: '+16%' },
            { category: 'Telecom', merchants: 1, volume: '₹22,00,000', growth: '+20%' },
        ];
    }
    getTransactionTrends() {
        return {
            daily: [
                { day: 'Mon', amount: 28000 }, { day: 'Tue', amount: 32000 },
                { day: 'Wed', amount: 25000 }, { day: 'Thu', amount: 38000 },
                { day: 'Fri', amount: 42000 }, { day: 'Sat', amount: 35000 },
                { day: 'Sun', amount: 22000 },
            ],
            weeklyTotal: 222000,
        };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [transactions_service_1.TransactionsService,
        users_service_1.UsersService,
        disputes_service_1.DisputesService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map