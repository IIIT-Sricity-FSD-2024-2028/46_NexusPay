import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SplitExpensesService } from './split-expenses.service';
import type { CreateSplitInput, UpdateSplitInput } from './split-expenses.service';
import type { SplitRecord } from './split-expenses.repository';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('Split Expenses')
@Controller('split-expenses')
@UseGuards(RolesGuard)
export class SplitExpensesController {
  constructor(private service: SplitExpensesService) {}

  @Get()
  @ApiOperation({ summary: 'List split expenses' })
  @ApiQuery({ name: 'userId', required: false, type: String })
  findAll(@Query('userId') userId?: string): SplitRecord[] {
    if (userId) return this.service.findByUser(userId);
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get split by ID' })
  findOne(@Param('id') id: string): SplitRecord { return this.service.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create split expense' })
  create(@Body() body: CreateSplitInput): SplitRecord { return this.service.create(body); }

  @Put(':id')
  @ApiOperation({ summary: 'Update split expense' })
  update(@Param('id') id: string, @Body() body: UpdateSplitInput): SplitRecord {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete split expense' })
  remove(@Param('id') id: string): { message: string } {
    this.service.remove(id);
    return { message: 'Split deleted' };
  }
}
