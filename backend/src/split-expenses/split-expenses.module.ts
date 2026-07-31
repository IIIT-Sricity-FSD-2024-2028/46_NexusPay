import { Module } from '@nestjs/common';
import { SplitExpensesController } from './split-expenses.controller';
import { SplitExpensesService } from './split-expenses.service';
import { SplitExpensesRepository } from './split-expenses.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [SplitExpensesController],
  providers: [SplitExpensesRepository, SplitExpensesService],
  exports: [SplitExpensesService],
})
export class SplitExpensesModule {}
