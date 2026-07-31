import { SplitExpensesService } from './split-expenses.service';
import type { CreateSplitInput, UpdateSplitInput } from './split-expenses.service';
import type { SplitRecord } from './split-expenses.repository';
export declare class SplitExpensesController {
    private service;
    constructor(service: SplitExpensesService);
    findAll(userId?: string): SplitRecord[];
    findOne(id: string): SplitRecord;
    create(body: CreateSplitInput): SplitRecord;
    update(id: string, body: UpdateSplitInput): SplitRecord;
    remove(id: string): {
        message: string;
    };
}
