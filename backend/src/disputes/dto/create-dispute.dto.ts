import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateDisputeDto {
  @ApiProperty({ example: 'TXN005' })
  @IsString()
  @IsNotEmpty()
  txnId: string;

  @ApiProperty({ example: 'john.c@nexuspay' })
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({ example: 450 })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({ example: 'Order not delivered' })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiPropertyOptional({ example: 'Detailed description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'amazon.m@nexuspay', description: 'User ID of who raised the dispute' })
  @IsOptional()
  @IsString()
  raisedBy?: string;

  @ApiPropertyOptional({ example: 'admin.a@nexuspay', description: 'Admin user assigned to handle the dispute' })
  @IsOptional()
  @IsString()
  assignedTo?: string;
}
