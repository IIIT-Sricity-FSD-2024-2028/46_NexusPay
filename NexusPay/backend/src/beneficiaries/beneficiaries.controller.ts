import {
  Controller, Get, Post, Delete,
  Param, Body, Query, UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BeneficiariesService } from './beneficiaries.service';
import type { CreateBeneficiaryInput } from './beneficiaries.service';
import type { BeneficiaryRecord } from './beneficiaries.repository';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('Beneficiaries')
@Controller('beneficiaries')
@UseGuards(RolesGuard)
export class BeneficiariesController {
  constructor(private service: BeneficiariesService) {}

  @Get()
  @ApiOperation({ summary: 'List beneficiaries' })
  @ApiQuery({ name: 'userId', required: false, type: String })
  findAll(@Query('userId') userId?: string): BeneficiaryRecord[] {
    if (userId) return this.service.findByUser(userId);
    return this.service.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Add beneficiary' })
  @ApiBody({ schema: { properties: { userId: { type: 'string' }, name: { type: 'string' }, beneficiaryId: { type: 'string' } } } })
  create(@Body() body: CreateBeneficiaryInput): BeneficiaryRecord { return this.service.create(body); }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove beneficiary' })
  remove(@Param('id') id: string): { message: string } {
    this.service.remove(id);
    return { message: 'Beneficiary removed' };
  }
}
