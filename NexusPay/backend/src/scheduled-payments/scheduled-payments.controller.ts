import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ScheduledPaymentsService } from './scheduled-payments.service';
import type { ScheduledPaymentRecord } from './scheduled-payments.service';
import { CreateScheduledPaymentDto } from './dto/create-scheduled-payment.dto';
import { UpdateScheduledPaymentDto } from './dto/update-scheduled-payment.dto';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('Scheduled Payments')
@Controller('scheduled-payments')
@UseGuards(RolesGuard)
export class ScheduledPaymentsController {
  constructor(private service: ScheduledPaymentsService) {}

  @Get()
  @ApiOperation({ summary: 'List scheduled payments' })
  @ApiQuery({ name: 'userId', required: false, type: String })
  findAll(@Query('userId') userId?: string): ScheduledPaymentRecord[] {
    if (userId) return this.service.findByUser(userId);
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get schedule by ID' })
  findOne(@Param('id') id: string): ScheduledPaymentRecord { return this.service.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create schedule' })
  create(@Body() dto: CreateScheduledPaymentDto): ScheduledPaymentRecord { return this.service.create(dto); }

  @Put(':id')
  @ApiOperation({ summary: 'Update schedule' })
  update(@Param('id') id: string, @Body() dto: UpdateScheduledPaymentDto): ScheduledPaymentRecord {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete schedule' })
  remove(@Param('id') id: string): { message: string } {
    this.service.remove(id);
    return { message: 'Schedule deleted' };
  }
}
