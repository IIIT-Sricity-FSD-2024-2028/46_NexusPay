import { Injectable } from '@nestjs/common';
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

@Injectable()
export class AnalyticsService {
  constructor(
    private txnService: TransactionsService,
    private usersService: UsersService,
    private disputesService: DisputesService,
  ) {}

  getDashboardStats(): DashboardStats {
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

  getRevenueData(): RevenueData {
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

  getSpendingBreakdown(_userId?: string): SpendingBreakdown {
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

  getCategoryPerformance(): CategoryPerformance[] {
    return [
      { category: 'E-commerce', merchants: 3, volume: '₹83,00,000', growth: '+23%' },
      { category: 'Food Delivery', merchants: 2, volume: '₹30,80,000', growth: '+15%' },
      { category: 'Transport', merchants: 1, volume: '₹8,90,000', growth: '+8%' },
      { category: 'Entertainment', merchants: 1, volume: '₹5,60,000', growth: '-3%' },
      { category: 'Fashion', merchants: 1, volume: '₹15,20,000', growth: '+16%' },
      { category: 'Telecom', merchants: 1, volume: '₹22,00,000', growth: '+20%' },
    ];
  }

  getTransactionTrends(): TransactionTrends {
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
}
