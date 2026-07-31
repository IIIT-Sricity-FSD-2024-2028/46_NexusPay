import { CategoriesService } from './categories.service';
import type { CategoryRecord, CategoryInput } from './categories.service';
export declare class CategoriesController {
    private service;
    constructor(service: CategoriesService);
    findAll(): CategoryRecord[];
    create(body: CategoryInput): CategoryRecord;
    update(id: string, body: Partial<CategoryInput>): CategoryRecord;
    remove(id: string): {
        message: string;
    };
}
