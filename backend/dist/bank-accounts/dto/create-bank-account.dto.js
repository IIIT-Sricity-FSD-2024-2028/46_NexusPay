"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBankAccountDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateBankAccountDto {
    bankName;
    holderName;
    accountNum;
    ifsc;
    balance;
    primary;
    userId;
}
exports.CreateBankAccountDto = CreateBankAccountDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'HDFC Bank' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBankAccountDto.prototype, "bankName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Rajesh Kumar' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBankAccountDto.prototype, "holderName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1234' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBankAccountDto.prototype, "accountNum", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'HDFC0001234' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBankAccountDto.prototype, "ifsc", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 94250.50 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateBankAccountDto.prototype, "balance", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateBankAccountDto.prototype, "primary", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'john.c@nexuspay' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBankAccountDto.prototype, "userId", void 0);
//# sourceMappingURL=create-bank-account.dto.js.map