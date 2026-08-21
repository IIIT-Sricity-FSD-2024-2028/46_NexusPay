import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import type { NotificationRecord, CreateNotificationDto } from './notifications.service';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(RolesGuard)
export class NotificationsController {
  constructor(private service: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'List notifications' })
  @ApiQuery({ name: 'userId', required: false, type: String })
  findAll(@Query('userId') userId?: string): NotificationRecord[] {
    if (userId) return this.service.findByUser(userId);
    return this.service.findAll();
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread count' })
  @ApiQuery({ name: 'userId', required: true, type: String })
  getUnread(@Query('userId') userId: string): { count: number } {
    return { count: this.service.getUnreadCount(userId) };
  }

  @Post()
  @ApiOperation({ summary: 'Create notification' })
  @ApiBody({ schema: { properties: { userId: { type: 'string' }, message: { type: 'string' }, type: { type: 'string' } } } })
  create(@Body() body: CreateNotificationDto): NotificationRecord { return this.service.create(body); }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  markRead(@Param('id') id: string): NotificationRecord { return this.service.markRead(id); }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all read' })
  @ApiQuery({ name: 'userId', required: true, type: String })
  markAllRead(@Query('userId') userId: string): { message: string } {
    this.service.markAllRead(userId);
    return { message: 'All marked read' };
  }

  @Delete()
  @ApiOperation({ summary: 'Clear all notifications' })
  @ApiQuery({ name: 'userId', required: true, type: String })
  clearAll(@Query('userId') userId: string): { message: string } {
    this.service.clearAll(userId);
    return { message: 'Cleared' };
  }
}
