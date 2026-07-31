"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankAccountsRepository = void 0;
const common_1 = require("@nestjs/common");
const json_store_1 = require("../common/json-store");
const SEED = [
    { id: 'ba1', userId: 'john.c@nexuspay', bankName: 'HDFC Bank', holderName: 'Rajesh Kumar', accountNum: '1234', ifsc: 'HDFC0001234', balance: 88250.50, primary: true },
    { id: 'ba2', userId: 'john.c@nexuspay', bankName: 'ICICI Bank', holderName: 'Rajesh Kumar', accountNum: '5678', ifsc: 'ICIC0005678', balance: 43200.00, primary: false },
    { id: 'ba3', userId: 'john.c@nexuspay', bankName: 'State Bank of India', holderName: 'Rajesh Kumar', accountNum: '9012', ifsc: 'SBIN0009012', balance: 28750.00, primary: false },
    { id: 'ba4', userId: 'amazon.m@nexuspay', bankName: 'HDFC Bank', holderName: 'Amazon India Pvt Ltd', accountNum: '4401', ifsc: 'HDFC0004401', balance: 524800, primary: true },
    { id: 'ba5', userId: 'amazon.m@nexuspay', bankName: 'ICICI Bank', holderName: 'Amazon India Pvt Ltd', accountNum: '7823', ifsc: 'ICIC0007823', balance: 218500, primary: false },
    { id: 'ba6', userId: 'amazon.m@nexuspay', bankName: 'Axis Bank', holderName: 'Amazon India Pvt Ltd', accountNum: '3356', ifsc: 'UTIB0003356', balance: 97200, primary: false },
];
let BankAccountsRepository = class BankAccountsRepository {
    store = new json_store_1.JsonStore('bank-accounts.json', SEED);
    findAll() { return this.store.readAll(); }
    findByUser(userId) { return this.store.readAll().filter(a => a.userId === userId); }
    findById(id) { return this.store.readAll().find(a => a.id === id); }
    findPrimary(userId) { return this.store.readAll().find(a => a.userId === userId && a.primary); }
    nextId() { return this.store.getNextId('ba', 'id', 1); }
    save(account) {
        const data = this.store.readAll();
        data.push(account);
        this.store.writeAll(data);
        return account;
    }
    update(id, partial) {
        const data = this.store.readAll();
        const record = data.find(a => a.id === id);
        if (!record)
            return undefined;
        Object.assign(record, partial);
        this.store.writeAll(data);
        return record;
    }
    clearPrimary(userId) {
        const data = this.store.readAll();
        data.forEach(a => { if (a.userId === userId)
            a.primary = false; });
        this.store.writeAll(data);
    }
    creditBalance(userId, amount) {
        const data = this.store.readAll();
        const primary = data.find(a => a.userId === userId && a.primary);
        if (primary) {
            primary.balance += amount;
            this.store.writeAll(data);
        }
    }
    deductBalance(userId, amount) {
        const data = this.store.readAll();
        const primary = data.find(a => a.userId === userId && a.primary);
        if (primary) {
            primary.balance = Math.max(0, primary.balance - amount);
            this.store.writeAll(data);
        }
    }
    deleteById(id) {
        const data = this.store.readAll();
        const idx = data.findIndex(a => a.id === id);
        if (idx === -1)
            return false;
        data.splice(idx, 1);
        this.store.writeAll(data);
        return true;
    }
};
exports.BankAccountsRepository = BankAccountsRepository;
exports.BankAccountsRepository = BankAccountsRepository = __decorate([
    (0, common_1.Injectable)()
], BankAccountsRepository);
//# sourceMappingURL=bank-accounts.repository.js.map