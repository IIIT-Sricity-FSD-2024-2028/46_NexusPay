"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const json_store_1 = require("../common/json-store");
const SEED = [
    { id: 'cat1', name: 'Food & Dining', description: 'Restaurants, delivery, groceries' },
    { id: 'cat2', name: 'Shopping', description: 'E-commerce, retail purchases' },
    { id: 'cat3', name: 'Entertainment', description: 'Movies, subscriptions, gaming' },
    { id: 'cat4', name: 'Transport', description: 'Ride-hailing, fuel, public transport' },
    { id: 'cat5', name: 'Utilities', description: 'Electricity, water, internet' },
    { id: 'cat6', name: 'Housing', description: 'Rent, maintenance' },
    { id: 'cat7', name: 'Friends & Family', description: 'P2P transfers' },
    { id: 'cat8', name: 'Retail', description: 'In-store purchases' },
    { id: 'cat9', name: 'Services', description: 'Professional services' },
    { id: 'cat10', name: 'Others', description: 'Miscellaneous' },
];
let CategoriesService = class CategoriesService {
    store = new json_store_1.JsonStore('categories.json', SEED);
    findAll() { return this.store.readAll(); }
    create(data) {
        const all = this.store.readAll();
        const c = {
            id: this.store.getNextId('cat', 'id', 1),
            name: data.name,
            description: data.description,
        };
        all.push(c);
        this.store.writeAll(all);
        return c;
    }
    update(id, data) {
        const all = this.store.readAll();
        const c = all.find(x => x.id === id);
        if (!c)
            throw new common_1.NotFoundException(`Category ${id} not found`);
        Object.assign(c, data);
        this.store.writeAll(all);
        return c;
    }
    remove(id) {
        const all = this.store.readAll();
        const idx = all.findIndex(c => c.id === id);
        if (idx !== -1) {
            all.splice(idx, 1);
            this.store.writeAll(all);
        }
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)()
], CategoriesService);
//# sourceMappingURL=categories.service.js.map