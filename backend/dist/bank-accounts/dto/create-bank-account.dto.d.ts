export declare class CreateBankAccountDto {
    bankName: string;
    holderName: string;
    accountNum: string;
    ifsc: string;
    balance?: number;
    primary?: boolean;
    userId?: string;
}
