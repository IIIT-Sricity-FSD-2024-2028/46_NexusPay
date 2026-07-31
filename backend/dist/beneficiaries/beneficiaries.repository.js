"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeneficiariesRepository = void 0;
const common_1 = require("@nestjs/common");
const json_store_1 = require("../common/json-store");
const SEED = [
    { id: 'b1', userId: 'john.c@nexuspay', name: 'Anjali Mehta', beneficiaryId: 'raj.c@nexuspay' },
    { id: 'b2', userId: 'john.c@nexuspay', name: 'Priya Sharma', beneficiaryId: 'sarah.c@nexuspay' },
    { id: 'b3', userId: 'john.c@nexuspay', name: 'Rahul Kumar', beneficiaryId: 'alice.c@nexuspay' },
    { id: 'b4', userId: 'john.c@nexuspay', name: 'Sneha Patel', beneficiaryId: 'bob.c@nexuspay' },
    { id: 'b5', userId: 'john.c@nexuspay', name: 'Vikram Singh', beneficiaryId: 'emma.c@nexuspay' },
    { id: 'b6', userId: 'john.c@nexuspay', name: 'Kavita Joshi', beneficiaryId: 'david.c@nexuspay' },
    { id: 'b7', userId: 'john.c@nexuspay', name: 'Arjun Nair', beneficiaryId: 'tom.c@nexuspay' },
    { id: 'b8', userId: 'john.c@nexuspay', name: 'Meera Reddy', beneficiaryId: 'priya.c@nexuspay' },
];
let BeneficiariesRepository = class BeneficiariesRepository {
    store = new json_store_1.JsonStore('beneficiaries.json', SEED);
    findAll() { return this.store.readAll(); }
    findByUserId(userId) { return this.store.readAll().filter(b => b.userId === userId); }
    findById(id) { return this.store.readAll().find(b => b.id === id); }
    nextId() { return this.store.getNextId('b', 'id', 1); }
    save(beneficiary) {
        const all = this.store.readAll();
        all.push(beneficiary);
        this.store.writeAll(all);
        return beneficiary;
    }
    deleteById(id) {
        const data = this.store.readAll();
        const idx = data.findIndex(b => b.id === id);
        if (idx === -1)
            return false;
        data.splice(idx, 1);
        this.store.writeAll(data);
        return true;
    }
};
exports.BeneficiariesRepository = BeneficiariesRepository;
exports.BeneficiariesRepository = BeneficiariesRepository = __decorate([
    (0, common_1.Injectable)()
], BeneficiariesRepository);
//# sourceMappingURL=beneficiaries.repository.js.map