import { TransactionsService, TransactionStats } from '../transactions/transactions.service';
import { UsersService } from '../users/users.service';
import { DisputesService, DisputeCounts } from '../disputes/disputes.service';
export interface DashboardStats extends TransactionStats {
    totalUsers: number;
    totalCustomers: number;
    totalMerchants: number;
    activeUsers: number;
    disputes: DisputeCounts;
}
export interface RevenueMonth {
    month: string;
    revenue: number;
    transactions: number;
}
export interface RevenueData {
    monthly: RevenueMonth[];
    totalRevenue: string;
    growthRate: string;
}
export interface SpendingCategory {
    name: string;
    amount: number;
    percentage: number;
    color: string;
}
export interface SpendingBreakdown {
    categories: SpendingCategory[];
    totalSpent: number;
    monthlyAverage: number;
}
export interface CategoryPerformance {
    category: string;
    merchants: number;
    volume: string;
    growth: string;
}
export interface DailyTrend {
    day: string;
    amount: number;
}
export interface TransactionTrends {
    daily: DailyTrend[];
    weeklyTotal: number;
}
export declare class AnalyticsService {
    private txnService;
    private usersService;
    private disputesService;
    constructor(txnService: TransactionsService, usersService: UsersService, disputesService: DisputesService);
    getDashboardStats(): DashboardStats;
    getRevenueData(): RevenueData;
    getSpendingBreakdown(_userId?: string): SpendingBreakdown;
    getCategoryPerformance(): CategoryPerformance[];
    getTransactionTrends(): TransactionTrends;
}
