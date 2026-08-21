import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateScheduledPaymentDto {
  @ApiProperty({ example: 'Rent Payment' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'amazon.m@nexuspay' })
  @IsString()
  @IsNotEmpty()
  receiverId: string;

  @ApiProperty({ example: 15000 })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({ example: 'monthly', enum: ['weekly', 'biweekly', 'monthly', 'quarterly'] })
  @IsString()
  @IsNotEmpty()
  frequency: string;

  @ApiProperty({ example: '2026-04-01' })
  @IsString()
  @IsNotEmpty()
  nextPayment: string;

  @ApiPropertyOptional({ example: 'john.c@nexuspay' })
  @IsOptional()
  @IsString()
  userId?: string;
}
