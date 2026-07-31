"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const roles_guard_1 = require("./common/guards/roles.guard");
const app_controller_1 = require("./app.controller");
const users_module_1 = require("./users/users.module");
const transactions_module_1 = require("./transactions/transactions.module");
const disputes_module_1 = require("./disputes/disputes.module");
const bank_accounts_module_1 = require("./bank-accounts/bank-accounts.module");
const scheduled_payments_module_1 = require("./scheduled-payments/scheduled-payments.module");
const beneficiaries_module_1 = require("./beneficiaries/beneficiaries.module");
const categories_module_1 = require("./categories/categories.module");
const notifications_module_1 = require("./notifications/notifications.module");
const split_expenses_module_1 = require("./split-expenses/split-expenses.module");
const analytics_module_1 = require("./analytics/analytics.module");
const logs_module_1 = require("./logs/logs.module");
const settings_module_1 = require("./settings/settings.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', '..', 'frontend'),
                serveRoot: '/frontend',
                serveStaticOptions: {
                    index: false,
                },
            }),
            users_module_1.UsersModule,
            transactions_module_1.TransactionsModule,
            disputes_module_1.DisputesModule,
            bank_accounts_module_1.BankAccountsModule,
            scheduled_payments_module_1.ScheduledPaymentsModule,
            beneficiaries_module_1.BeneficiariesModule,
            categories_module_1.CategoriesModule,
            notifications_module_1.NotificationsModule,
            split_expenses_module_1.SplitExpensesModule,
            analytics_module_1.AnalyticsModule,
            logs_module_1.LogsModule,
            settings_module_1.SettingsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: roles_guard_1.RolesGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map