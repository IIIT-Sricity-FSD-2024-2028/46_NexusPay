import { Module } from '@nestjs/common';
import { BeneficiariesController } from './beneficiaries.controller';
import { BeneficiariesService } from './beneficiaries.service';
import { BeneficiariesRepository } from './beneficiaries.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [BeneficiariesController],
  providers: [BeneficiariesRepository, BeneficiariesService],
  exports: [BeneficiariesService],
})
export class BeneficiariesModule {}
