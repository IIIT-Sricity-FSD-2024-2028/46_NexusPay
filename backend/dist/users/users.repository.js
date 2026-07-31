"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRepository = void 0;
const common_1 = require("@nestjs/common");
const json_store_1 = require("../common/json-store");
const SEED = [
    { id: 'CUST001', email: 'john@example.com', password: 'Pass@word1', role: 'customer', status: 'Active', joined: '2023-06-12', txns: 145, vpa: 'john.c@nexuspay', name: 'John Kumar' },
    { id: 'CUST002', email: 'alice@example.com', password: 'Pass@word1', role: 'customer', status: 'Active', joined: '2023-07-20', txns: 89, vpa: 'alice.c@nexuspay', name: 'Alice Mehta' },
    { id: 'CUST003', email: 'bob@example.com', password: 'Pass@word1', role: 'customer', status: 'Active', joined: '2023-04-05', txns: 203, vpa: 'bob.c@nexuspay', name: 'Bob Sharma' },
    { id: 'CUST004', email: 'emma@example.com', password: 'Pass@word1', role: 'customer', status: 'Inactive', joined: '2023-11-18', txns: 56, vpa: 'emma.c@nexuspay', name: 'Emma Gupta' },
    { id: 'CUST005', email: 'david@example.com', password: 'Pass@word1', role: 'customer', status: 'Active', joined: '2023-03-25', txns: 178, vpa: 'david.c@nexuspay', name: 'David Singh' },
    { id: 'CUST006', email: 'sarah@example.com', password: 'Pass@word1', role: 'customer', status: 'Active', joined: '2023-08-14', txns: 112, vpa: 'sarah.c@nexuspay', name: 'Sarah Patel' },
    { id: 'CUST007', email: 'tom@example.com', password: 'Pass@word1', role: 'customer', status: 'Inactive', joined: '2024-01-02', txns: 8, vpa: 'tom.c@nexuspay', name: 'Tom Verma' },
    { id: 'CUST008', email: 'priya@example.com', password: 'Pass@word1', role: 'customer', status: 'Active', joined: '2023-05-30', txns: 167, vpa: 'priya.c@nexuspay', name: 'Priya Rao' },
    { id: 'CUST009', email: 'raj@example.com', password: 'Pass@word1', role: 'customer', status: 'Active', joined: '2023-09-08', txns: 94, vpa: 'raj.c@nexuspay', name: 'Raj Nair' },
    { id: 'CUST010', email: 'neha@example.com', password: 'Pass@word1', role: 'customer', status: 'Inactive', joined: '2024-02-14', txns: 3, vpa: 'neha.c@nexuspay', name: 'Neha Joshi' },
    { id: 'MERCH001', email: 'pay@amazon.in', password: 'Merchant@123', role: 'merchant', status: 'Active', joined: '2023-01-15', txns: 12400, vpa: 'amazon.m@nexuspay', name: 'Amazon' },
    { id: 'MERCH002', email: 'billing@swiggy.in', password: 'Merchant@123', role: 'merchant', status: 'Active', joined: '2023-02-20', txns: 8900, vpa: 'swiggy.m@nexuspay', name: 'Swiggy' },
    { id: 'MERCH003', email: 'pay@flipkart.com', password: 'Merchant@123', role: 'merchant', status: 'Active', joined: '2023-01-10', txns: 10200, vpa: 'flipkart.m@nexuspay', name: 'Flipkart' },
    { id: 'MERCH004', email: 'pay@zomato.com', password: 'Merchant@123', role: 'merchant', status: 'Active', joined: '2023-03-05', txns: 6700, vpa: 'zomato.m@nexuspay', name: 'Zomato' },
    { id: 'MERCH005', email: 'billing@uber.com', password: 'Merchant@123', role: 'merchant', status: 'Active', joined: '2023-04-12', txns: 4500, vpa: 'uber.m@nexuspay', name: 'Uber' },
    { id: 'MERCH006', email: 'pay@netflix.com', password: 'Merchant@123', role: 'merchant', status: 'Inactive', joined: '2023-05-18', txns: 2800, vpa: 'netflix.m@nexuspay', name: 'Netflix' },
    { id: 'MERCH007', email: 'billing@myntra.com', password: 'Merchant@123', role: 'merchant', status: 'Active', joined: '2023-06-01', txns: 5600, vpa: 'myntra.m@nexuspay', name: 'Myntra' },
    { id: 'MERCH008', email: 'pay@jio.com', password: 'Merchant@123', role: 'merchant', status: 'Active', joined: '2023-02-28', txns: 9800, vpa: 'jio.m@nexuspay', name: 'Jio' },
    { id: 'ADMIN001', email: 'admin@nexuspay.com', password: 'Admin@123!', role: 'admin', status: 'Active', joined: '2023-01-01', txns: 0 },
    { id: 'SUPER001', email: 'super@nexuspay.com', password: 'Super@123!', role: 'superuser', status: 'Active', joined: '2023-01-01', txns: 0 },
];
function rolePrefix(role) {
    switch (role) {
        case 'customer': return 'CUST';
        case 'merchant': return 'MERCH';
        case 'admin': return 'ADMIN';
        case 'superuser': return 'SUPER';
        default: return 'USER';
    }
}
let UsersRepository = class UsersRepository {
    store = new json_store_1.JsonStore('users.json', SEED);
    findAll() { return this.store.readAll(); }
    findById(id) { return this.store.readAll().find(u => u.id === id); }
    findByEmail(email) { return this.store.readAll().find(u => u.email === email); }
    nextId(role) { return this.store.getNextId(rolePrefix(role)); }
    save(user) {
        const data = this.store.readAll();
        data.push(user);
        this.store.writeAll(data);
        return user;
    }
    update(id, partial) {
        const data = this.store.readAll();
        const record = data.find(u => u.id === id);
        if (!record)
            return undefined;
        Object.assign(record, partial);
        this.store.writeAll(data);
        return record;
    }
    deleteById(id) {
        const data = this.store.readAll();
        const idx = data.findIndex(u => u.id === id);
        if (idx === -1)
            return false;
        data.splice(idx, 1);
        this.store.writeAll(data);
        return true;
    }
};
exports.UsersRepository = UsersRepository;
exports.UsersRepository = UsersRepository = __decorate([
    (0, common_1.Injectable)()
], UsersRepository);
//# sourceMappingURL=users.repository.js.map