import { Module } from '@nestjs/common';
import { DisputesController } from './disputes.controller';
import { DisputesService } from './disputes.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [NotificationsModule, LogsModule],
  controllers: [DisputesController],
  providers: [DisputesService],
  exports: [DisputesService],
})
export class DisputesModule {}
