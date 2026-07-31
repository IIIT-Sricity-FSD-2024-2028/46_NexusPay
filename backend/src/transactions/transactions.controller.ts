import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import type { TransactionStats } from './transactions.service';
import type { TransactionRecord } from './transactions.repository';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { NotificationsService } from '../notifications/notifications.service';
import { LogsService } from '../logs/logs.service';
import { UsersService } from '../users/users.service';
import { BankAccountsService } from '../bank-accounts/bank-accounts.service';

@ApiTags('Transactions')
@Controller('transactions')
@UseGuards(RolesGuard)
export class TransactionsController {
  constructor(
    private service: TransactionsService,
    private notificationsService: NotificationsService,
    private logsService: LogsService,
    private usersService: UsersService,
    private bankAccountsService: BankAccountsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all transactions with optional filters' })
  @ApiQuery({ name: 'status', required: false, enum: ['all', 'Completed', 'Pending', 'Failed'] })
  @ApiQuery({ name: 'type', required: false, enum: ['all', 'Transfer', 'Payment', 'Refund', 'Split', 'Scheduled'] })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'user', required: false, description: 'Filter by sender/receiver ID' })
  findAll(
    @Query('status') status?: string,
    @Query('type') type?: string,
    @Query('search') search?: string,
    @Query('user') user?: string,
  ): TransactionRecord[] {
    if (user) return this.service.findByUser(user, { status, type, search });
    return this.service.findAll({ status, type, search });
  }

  @Get('stats')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Get transaction statistics' })
  getStats(): TransactionStats { return this.service.getStats(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction by ID' })
  findOne(@Param('id') id: string): TransactionRecord { return this.service.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({ status: 201, description: 'Transaction created' })
  create(@Body() dto: CreateTransactionDto): TransactionRecord {
    const txn = this.service.create(dto);
    try {
      const senderUser = this.usersService.findOne(dto.senderId);
      this.notificationsService.create({
        userId: senderUser.id,
        message: `Payment of ₹${dto.amount.toLocaleString('en-IN')} sent to ${dto.receiverId}`,
        type: 'payment',
      });
      this.usersService.incrementTxns(senderUser.id);
      if (txn.status === 'Completed') {
        this.bankAccountsService.deductBalance(senderUser.id, dto.amount);
      }
      this.tryNotifyReceiver(dto, txn.status);
      this.logsService.create({
        user: dto.senderId,
        action: 'Transaction Created',
        module: 'Transactions',
        severity: 'info',
        details: `${txn.id}: ${dto.senderId} → ${dto.receiverId} ₹${dto.amount} (${txn.status})`,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.warn('Transaction side-effect error:', msg);
    }
    return txn;
  }

  private tryNotifyReceiver(dto: CreateTransactionDto, txnStatus: string): void {
    try {
      const receiverUser = this.usersService.findOne(dto.receiverId);
      this.notificationsService.create({
        userId: receiverUser.id,
        message: `Received ₹${dto.amount.toLocaleString('en-IN')} from ${dto.senderId}`,
        type: 'received',
      });
      this.usersService.incrementTxns(receiverUser.id);
      if (txnStatus === 'Completed') {
        this.bankAccountsService.creditBalance(receiverUser.id, dto.amount);
      }
    } catch (_e) {
      // receiver may not be a registered user — silently ignore
    }
  }

  @Put(':id')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Update transaction' })
  update(@Param('id') id: string, @Body() dto: UpdateTransactionDto): TransactionRecord {
    const txn = this.service.update(id, dto);
    try {
      if (dto.status) {
        this.logsService.create({
          user: 'System',
          action: 'Transaction Updated',
          module: 'Transactions',
          severity: dto.status === 'Failed' ? 'warning' : 'info',
          details: `${id} status changed to ${dto.status}`,
        });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.warn('Transaction update side-effect error:', msg);
    }
    return txn;
  }

  @Delete(':id')
  @Roles('superuser')
  @ApiOperation({ summary: 'Delete transaction' })
  remove(@Param('id') id: string): { message: string } {
    this.service.remove(id);
    try {
      this.logsService.create({
        user: 'System',
        action: 'Transaction Deleted',
        module: 'Transactions',
        severity: 'warning',
        details: `Transaction ${id} was deleted`,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.warn('Transaction delete side-effect error:', msg);
    }
    return { message: `Transaction ${id} deleted` };
  }
}
