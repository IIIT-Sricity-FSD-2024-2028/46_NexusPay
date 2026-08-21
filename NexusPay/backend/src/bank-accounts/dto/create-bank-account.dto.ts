import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBankAccountDto {
  @ApiProperty({ example: 'HDFC Bank' })
  @IsString()
  @IsNotEmpty()
  bankName: string;

  @ApiProperty({ example: 'Rajesh Kumar' })
  @IsString()
  @IsNotEmpty()
  holderName: string;

  @ApiProperty({ example: '1234' })
  @IsString()
  @IsNotEmpty()
  accountNum: string;

  @ApiProperty({ example: 'HDFC0001234' })
  @IsString()
  @IsNotEmpty()
  ifsc: string;

  @ApiPropertyOptional({ example: 94250.50 })
  @IsOptional()
  @IsNumber()
  balance?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  primary?: boolean;

  @ApiPropertyOptional({ example: 'john.c@nexuspay' })
  @IsOptional()
  @IsString()
  userId?: string;
}
