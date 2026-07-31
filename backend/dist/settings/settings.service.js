"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const json_store_1 = require("../common/json-store");
const SEED = [
    {
        userId: 'john.c@nexuspay', name: 'Rajesh Kumar', email: 'rajesh@nexuspay.com',
        theme: 'dark', privacy: { showProfile: true, showTransactions: false },
    },
    {
        userId: 'admin.a@nexuspay', name: 'Admin User', email: 'admin@nexuspay.com',
        theme: 'dark', privacy: { showProfile: true, showTransactions: true },
    },
    {
        userId: 'super.s@nexuspay', name: 'Super Admin', email: 'super@nexuspay.com',
        theme: 'dark', privacy: { showProfile: true, showTransactions: true },
    },
];
let SettingsService = class SettingsService {
    store = new json_store_1.JsonStore('settings.json', SEED);
    findByUser(userId) {
        const data = this.store.readAll();
        const s = data.find(x => x.userId === userId);
        if (!s) {
            const def = {
                userId, name: '', email: '', theme: 'dark',
                privacy: { showProfile: true, showTransactions: false },
            };
            data.push(def);
            this.store.writeAll(data);
            return def;
        }
        return s;
    }
    update(userId, input) {
        const data = this.store.readAll();
        let s = data.find(x => x.userId === userId);
        if (!s) {
            s = {
                userId, name: '', email: '', theme: 'dark',
                privacy: { showProfile: true, showTransactions: false },
            };
            data.push(s);
        }
        Object.assign(s, input);
        this.store.writeAll(data);
        return s;
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)()
], SettingsService);
//# sourceMappingURL=settings.service.js.map