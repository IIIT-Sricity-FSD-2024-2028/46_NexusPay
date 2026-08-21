import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import type {
  DashboardStats,
  RevenueData,
  SpendingBreakdown,
  CategoryPerformance,
  TransactionTrends,
} from './analytics.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(RolesGuard)
export class AnalyticsController {
  constructor(private service: AnalyticsService) {}

  @Get('dashboard')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  getDashboard(): DashboardStats { return this.service.getDashboardStats(); }

  @Get('revenue')
  @Roles('admin', 'merchant', 'superuser')
  @ApiOperation({ summary: 'Get revenue data' })
  getRevenue(): RevenueData { return this.service.getRevenueData(); }

  @Get('spending')
  @ApiOperation({ summary: 'Get spending breakdown' })
  @ApiQuery({ name: 'userId', required: false, type: String })
  getSpending(@Query('userId') userId?: string): SpendingBreakdown {
    return this.service.getSpendingBreakdown(userId);
  }

  @Get('categories')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Get category performance' })
  getCategoryPerformance(): CategoryPerformance[] { return this.service.getCategoryPerformance(); }

  @Get('trends')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Get transaction trends' })
  getTrends(): TransactionTrends { return this.service.getTransactionTrends(); }
}
