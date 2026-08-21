import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      name: 'NexusPay API',
      version: '1.0.0',
      status: 'running',
      docs: '/api/docs',
      endpoints: {
        users: '/api/users',
        transactions: '/api/transactions',
        disputes: '/api/disputes',
        bankAccounts: '/api/bank-accounts',
        scheduledPayments: '/api/scheduled-payments',
        beneficiaries: '/api/beneficiaries',
        categories: '/api/categories',
        notifications: '/api/notifications',
        splitExpenses: '/api/split-expenses',
        analytics: '/api/analytics',
        logs: '/api/logs',
        settings: '/api/settings',
      },
    };
  }
}
