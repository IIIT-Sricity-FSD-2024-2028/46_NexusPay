import { AnalyticsService } from './analytics.service';
import type { DashboardStats, RevenueData, SpendingBreakdown, CategoryPerformance, TransactionTrends } from './analytics.service';
export declare class AnalyticsController {
    private service;
    constructor(service: AnalyticsService);
    getDashboard(): DashboardStats;
    getRevenue(): RevenueData;
    getSpending(userId?: string): SpendingBreakdown;
    getCategoryPerformance(): CategoryPerformance[];
    getTrends(): TransactionTrends;
}
