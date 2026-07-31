import {
  Controller, Get, Post, Delete,
  Param, Body, Query, UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { LogsService } from './logs.service';
import type { LogRecord, CreateLogDto, LogFilters } from './logs.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Logs')
@Controller('logs')
@UseGuards(RolesGuard)
export class LogsController {
  constructor(private service: LogsService) {}

  @Get()
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'List activity logs' })
  @ApiQuery({ name: 'module', required: false })
  @ApiQuery({ name: 'severity', required: false })
  findAll(@Query('module') module?: string, @Query('severity') severity?: string): LogRecord[] {
    const filters: LogFilters = { module, severity };
    return this.service.findAll(filters);
  }

  @Post()
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Create log entry' })
  @ApiBody({ schema: { properties: { user: { type: 'string' }, action: { type: 'string' }, module: { type: 'string' }, severity: { type: 'string' }, details: { type: 'string' } } } })
  create(@Body() body: CreateLogDto): LogRecord { return this.service.create(body); }

  @Delete(':id')
  @Roles('superuser')
  @ApiOperation({ summary: 'Delete log entry' })
  remove(@Param('id') id: string): { message: string } {
    this.service.remove(id);
    return { message: 'Log deleted' };
  }
}
