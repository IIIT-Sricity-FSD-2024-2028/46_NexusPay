import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsIn, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'rahul@nexuspay.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'customer', enum: ['customer', 'merchant', 'admin', 'superuser'] })
  @IsString()
  @IsIn(['customer', 'merchant', 'admin', 'superuser'])
  role: string;

  @ApiPropertyOptional({ example: 'Active', enum: ['Active', 'Inactive', 'Frozen', 'Suspended'] })
  @IsOptional()
  @IsString()
  status?: string;
}
