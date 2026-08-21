import { Module } from '@nestjs/common';
import { ScheduledPaymentsController } from './scheduled-payments.controller';
import { ScheduledPaymentsService } from './scheduled-payments.service';

@Module({
  controllers: [ScheduledPaymentsController],
  providers: [ScheduledPaymentsService],
  exports: [ScheduledPaymentsService],
})
export class ScheduledPaymentsModule {}
