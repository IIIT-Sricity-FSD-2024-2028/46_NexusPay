import {
  Controller, Get, Post, Put, Patch, Delete,
  Param, Body, Query, Headers, UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import type { UserRecord } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Users')
@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login (returns user for role-based routing, no auth token)' })
  login(
    @Body() body: { email: string },
    @Headers('x-password') password: string,
  ): { success: boolean; user?: Partial<UserRecord>; message?: string } {
    const user = this.usersService.findByEmail(body.email);
    if (!user || user.password !== password) {
      return { success: false, message: 'Invalid credentials' };
    }
    return {
      success: true,
      user: { id: user.id, email: user.email, role: user.role, status: user.status, vpa: user.vpa, name: user.name },
    };
  }

  @Get()
  @Roles('admin', 'superuser', 'merchant', 'customer')
  @ApiOperation({ summary: 'List all users' })
  @ApiQuery({ name: 'role', required: false, enum: ['customer', 'merchant', 'admin', 'superuser'] })
  @ApiResponse({ status: 200, description: 'Users list returned' })
  findAll(@Query('role') role?: string): UserRecord[] {
    return this.usersService.findAll(role);
  }

  @Get('customers')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'List all customers' })
  findCustomers(): UserRecord[] { return this.usersService.getCustomers(); }

  @Get('merchants')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'List all merchants' })
  findMerchants(): UserRecord[] { return this.usersService.getMerchants(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string): UserRecord { return this.usersService.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created' })
  create(@Body() dto: CreateUserDto, @Headers('x-password') password: string): UserRecord {
    return this.usersService.create(dto, password);
  }

  @Put(':id')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Update user' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto): UserRecord {
    return this.usersService.update(id, dto);
  }

  @Patch(':id/status')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Update user status (freeze/unfreeze)' })
  updateStatus(@Param('id') id: string, @Body('status') status: string): UserRecord {
    return this.usersService.updateStatus(id, status);
  }

  @Delete(':id')
  @Roles('superuser')
  @ApiOperation({ summary: 'Delete user' })
  remove(@Param('id') id: string): { message: string } {
    this.usersService.remove(id);
    return { message: `User #${id} deleted` };
  }
}
