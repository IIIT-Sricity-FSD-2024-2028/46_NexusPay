export interface UserRecord {
    id: string;
    email: string;
    password: string;
    role: string;
    status: string;
    joined: string;
    txns: number;
    vpa?: string;
    name?: string;
}
export declare class UsersRepository {
    private store;
    findAll(): UserRecord[];
    findById(id: string): UserRecord | undefined;
    findByEmail(email: string): UserRecord | undefined;
    nextId(role: string): string;
    save(user: UserRecord): UserRecord;
    update(id: string, partial: Partial<UserRecord>): UserRecord | undefined;
    deleteById(id: string): boolean;
}
