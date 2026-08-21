import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BankAccountsService } from './bank-accounts.service';
import type { BankAccountRecord } from './bank-accounts.repository';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('Bank Accounts')
@Controller('bank-accounts')
@UseGuards(RolesGuard)
export class BankAccountsController {
  constructor(private service: BankAccountsService) {}

  @Get()
  @ApiOperation({ summary: 'List bank accounts' })
  @ApiQuery({ name: 'userId', required: false, type: String })
  findAll(@Query('userId') userId?: string): BankAccountRecord[] {
    if (userId) return this.service.findByUser(userId);
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get bank account by ID' })
  findOne(@Param('id') id: string): BankAccountRecord { return this.service.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Link a new bank account' })
  create(@Body() dto: CreateBankAccountDto): BankAccountRecord { return this.service.create(dto); }

  @Post('deduct')
  @ApiOperation({ summary: 'Deduct amount from primary bank account' })
  @ApiBody({ schema: { properties: { userId: { type: 'string' }, amount: { type: 'number' } } } })
  deduct(@Body() body: { userId: string; amount: number }): { success: boolean; message: string } {
    this.service.deductBalance(body.userId, body.amount);
    return { success: true, message: 'Balance deducted' };
  }

  @Post('credit')
  @ApiOperation({ summary: 'Credit amount to primary bank account' })
  @ApiBody({ schema: { properties: { userId: { type: 'string' }, amount: { type: 'number' } } } })
  credit(@Body() body: { userId: string; amount: number }): { success: boolean; message: string } {
    this.service.creditBalance(body.userId, body.amount);
    return { success: true, message: 'Balance credited' };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update bank account' })
  update(@Param('id') id: string, @Body() dto: UpdateBankAccountDto): BankAccountRecord {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove bank account' })
  remove(@Param('id') id: string): { message: string } {
    this.service.remove(id);
    return { message: 'Bank account removed' };
  }
}
