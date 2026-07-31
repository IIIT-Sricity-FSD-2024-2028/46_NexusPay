export declare class JsonStore<T extends object> {
    private filePath;
    private defaults;
    constructor(filename: string, defaults: T[]);
    readAll(): T[];
    writeAll(data: T[]): void;
    getNextId(prefix: string, idField?: keyof T, padLength?: number): string;
    getNextNumericId(idField?: keyof T): number;
}
