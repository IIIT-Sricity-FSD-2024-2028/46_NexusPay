import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { RolesGuard } from './common/guards/roles.guard';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';
import { DisputesModule } from './disputes/disputes.module';
import { BankAccountsModule } from './bank-accounts/bank-accounts.module';
import { ScheduledPaymentsModule } from './scheduled-payments/scheduled-payments.module';
import { BeneficiariesModule } from './beneficiaries/beneficiaries.module';
import { CategoriesModule } from './categories/categories.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SplitExpensesModule } from './split-expenses/split-expenses.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { LogsModule } from './logs/logs.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'frontend'),
      serveRoot: '/frontend',
      serveStaticOptions: {
        index: false,
      },
    }),
    UsersModule,
    TransactionsModule,
    DisputesModule,
    BankAccountsModule,
    ScheduledPaymentsModule,
    BeneficiariesModule,
    CategoriesModule,
    NotificationsModule,
    SplitExpensesModule,
    AnalyticsModule,
    LogsModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
