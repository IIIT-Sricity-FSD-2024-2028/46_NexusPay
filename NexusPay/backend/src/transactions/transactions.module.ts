import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TransactionsRepository } from './transactions.repository';
import { NotificationsModule } from '../notifications/notifications.module';
import { LogsModule } from '../logs/logs.module';
import { UsersModule } from '../users/users.module';
import { BankAccountsModule } from '../bank-accounts/bank-accounts.module';

@Module({
  imports: [NotificationsModule, LogsModule, UsersModule, BankAccountsModule],
  controllers: [TransactionsController],
  providers: [TransactionsRepository, TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
