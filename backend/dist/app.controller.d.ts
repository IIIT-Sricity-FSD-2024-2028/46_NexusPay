export declare class AppController {
    getRoot(): {
        name: string;
        version: string;
        status: string;
        docs: string;
        endpoints: {
            users: string;
            transactions: string;
            disputes: string;
            bankAccounts: string;
            scheduledPayments: string;
            beneficiaries: string;
            categories: string;
            notifications: string;
            splitExpenses: string;
            analytics: string;
            logs: string;
            settings: string;
        };
    };
}
