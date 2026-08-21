import {
  Controller, Get, Post, Put, Delete,
  Param, Body, UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import type { CategoryRecord, CategoryInput } from './categories.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Categories')
@Controller('categories')
@UseGuards(RolesGuard)
export class CategoriesController {
  constructor(private service: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'List all categories' })
  findAll(): CategoryRecord[] { return this.service.findAll(); }

  @Post()
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Create category' })
  @ApiBody({ schema: { properties: { name: { type: 'string' }, description: { type: 'string' } } } })
  create(@Body() body: CategoryInput): CategoryRecord { return this.service.create(body); }

  @Put(':id')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Update category' })
  update(@Param('id') id: string, @Body() body: Partial<CategoryInput>): CategoryRecord {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @Roles('superuser')
  @ApiOperation({ summary: 'Delete category' })
  remove(@Param('id') id: string): { message: string } {
    this.service.remove(id);
    return { message: 'Category deleted' };
  }
}
