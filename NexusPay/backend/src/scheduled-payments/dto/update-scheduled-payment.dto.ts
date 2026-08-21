import { PartialType } from '@nestjs/swagger';
import { CreateScheduledPaymentDto } from './create-scheduled-payment.dto';

export class UpdateScheduledPaymentDto extends PartialType(CreateScheduledPaymentDto) {}
