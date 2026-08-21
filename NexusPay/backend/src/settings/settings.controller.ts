import {
  Controller, Get, Put,
  Param, Body, UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import type { SettingsRecord } from './settings.service';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('Settings')
@Controller('settings')
@UseGuards(RolesGuard)
export class SettingsController {
  constructor(private service: SettingsService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get user settings' })
  findOne(@Param('userId') userId: string): SettingsRecord { return this.service.findByUser(userId); }

  @Put(':userId')
  @ApiOperation({ summary: 'Update user settings' })
  update(@Param('userId') userId: string, @Body() body: Partial<SettingsRecord>): SettingsRecord {
    return this.service.update(userId, body);
  }
}
