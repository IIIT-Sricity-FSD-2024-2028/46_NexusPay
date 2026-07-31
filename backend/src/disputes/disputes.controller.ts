import {
  Controller, Get, Post, Put, Patch, Delete,
  Param, Body, Query, UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { DisputesService } from './disputes.service';
import type { DisputeRecord, DisputeCounts } from './disputes.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { UpdateDisputeDto } from './dto/update-dispute.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { NotificationsService } from '../notifications/notifications.service';
import { LogsService } from '../logs/logs.service';

@ApiTags('Disputes')
@Controller('disputes')
@UseGuards(RolesGuard)
export class DisputesController {
  constructor(
    private service: DisputesService,
    private notificationsService: NotificationsService,
    private logsService: LogsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List disputes' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'customer', required: false })
  @ApiQuery({ name: 'raisedBy', required: false })
  @ApiQuery({ name: 'assignedTo', required: false })
  findAll(
    @Query('status') status?: string,
    @Query('customer') customer?: string,
    @Query('raisedBy') raisedBy?: string,
    @Query('assignedTo') assignedTo?: string,
  ): DisputeRecord[] {
    if (raisedBy) return this.service.findByRaisedBy(raisedBy);
    if (assignedTo) return this.service.findByAssignedTo(assignedTo);
    if (customer) return this.service.findByCustomer(customer);
    return this.service.findAll(status);
  }

  @Get('counts')
  @ApiOperation({ summary: 'Get dispute counts by status' })
  getCounts(): DisputeCounts { return this.service.getCounts(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get dispute by ID' })
  findOne(@Param('id') id: string): DisputeRecord { return this.service.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Raise a new dispute' })
  create(@Body() dto: CreateDisputeDto): DisputeRecord {
    const dispute = this.service.create(dto);
    try {
      this.notificationsService.create({
        userId: dto.customerId,
        message: `Dispute ${dispute.id} filed for ₹${dto.amount}`,
        type: 'dispute',
      });
      this.logsService.create({
        user: dto.customerId,
        action: 'Dispute Created',
        module: 'Disputes',
        severity: 'info',
        details: `${dispute.id}: ${dto.customerId} — ₹${dto.amount} (${dto.reason})`,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.warn('Dispute side-effect error:', msg);
    }
    return dispute;
  }

  @Put(':id')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Update dispute' })
  update(@Param('id') id: string, @Body() dto: UpdateDisputeDto): DisputeRecord {
    const dispute = this.service.update(id, dto);
    try {
      const updatedStatus = (dto as { status?: string }).status;
      if (updatedStatus) {
        this.notificationsService.create({
          userId: dispute.customerId,
          message: `Dispute ${id} status updated to ${updatedStatus}`,
          type: 'dispute',
        });
        this.logsService.create({
          user: 'Admin',
          action: 'Dispute Updated',
          module: 'Disputes',
          severity: 'info',
          details: `${id} status changed to ${updatedStatus}`,
        });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.warn('Dispute update side-effect error:', msg);
    }
    return dispute;
  }

  @Patch(':id/status')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Update dispute status' })
  updateStatus(@Param('id') id: string, @Body('status') status: string): DisputeRecord {
    const dispute = this.service.updateStatus(id, status);
    try {
      this.notificationsService.create({
        userId: dispute.customerId,
        message: `Dispute ${id} status updated to ${status}`,
        type: 'dispute',
      });
      this.logsService.create({
        user: 'Admin',
        action: 'Dispute Status Changed',
        module: 'Disputes',
        severity: 'info',
        details: `${id} moved to ${status}`,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.warn('Dispute status side-effect error:', msg);
    }
    return dispute;
  }

  @Delete(':id')
  @Roles('superuser')
  @ApiOperation({ summary: 'Delete dispute' })
  remove(@Param('id') id: string): { message: string } {
    this.service.remove(id);
    try {
      this.logsService.create({
        user: 'System',
        action: 'Dispute Deleted',
        module: 'Disputes',
        severity: 'warning',
        details: `Dispute ${id} was deleted`,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.warn('Dispute delete side-effect error:', msg);
    }
    return { message: `Dispute ${id} deleted` };
  }
}
