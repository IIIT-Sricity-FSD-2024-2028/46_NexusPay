"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplitExpensesModule = void 0;
const common_1 = require("@nestjs/common");
const split_expenses_controller_1 = require("./split-expenses.controller");
const split_expenses_service_1 = require("./split-expenses.service");
const split_expenses_repository_1 = require("./split-expenses.repository");
const users_module_1 = require("../users/users.module");
let SplitExpensesModule = class SplitExpensesModule {
};
exports.SplitExpensesModule = SplitExpensesModule;
exports.SplitExpensesModule = SplitExpensesModule = __decorate([
    (0, common_1.Module)({
        imports: [users_module_1.UsersModule],
        controllers: [split_expenses_controller_1.SplitExpensesController],
        providers: [split_expenses_repository_1.SplitExpensesRepository, split_expenses_service_1.SplitExpensesService],
        exports: [split_expenses_service_1.SplitExpensesService],
    })
], SplitExpensesModule);
//# sourceMappingURL=split-expenses.module.js.map