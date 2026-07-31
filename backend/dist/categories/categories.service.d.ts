export interface CategoryRecord {
    id: string;
    name: string;
    description: string;
}
export interface CategoryInput {
    name: string;
    description: string;
}
export declare class CategoriesService {
    private store;
    findAll(): CategoryRecord[];
    create(data: CategoryInput): CategoryRecord;
    update(id: string, data: Partial<CategoryInput>): CategoryRecord;
    remove(id: string): void;
}
