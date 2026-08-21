import { Module } from '@nestjs/common';
import { BankAccountsController } from './bank-accounts.controller';
import { BankAccountsService } from './bank-accounts.service';
import { BankAccountsRepository } from './bank-accounts.repository';

@Module({
  controllers: [BankAccountsController],
  providers: [BankAccountsRepository, BankAccountsService],
  exports: [BankAccountsService],
})
export class BankAccountsModule {}
