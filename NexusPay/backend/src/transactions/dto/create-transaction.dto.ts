import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({ example: 'john.c@nexuspay' })
  @IsString()
  @IsNotEmpty()
  senderId: string;

  @ApiProperty({ example: 'amazon.m@nexuspay' })
  @IsString()
  @IsNotEmpty()
  receiverId: string;

  @ApiProperty({ example: 5000 })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({ example: 'Payment', enum: ['Transfer', 'Payment', 'Refund', 'Split', 'Scheduled'] })
  @IsString()
  @IsIn(['Transfer', 'Payment', 'Refund', 'Split', 'Scheduled'])
  type: string;

  @ApiPropertyOptional({ example: 'Food & Dining' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 'Completed', enum: ['Completed', 'Pending', 'Failed'] })
  @IsOptional()
  @IsString()
  status?: string;
}
