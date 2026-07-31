import { UsersRepository, UserRecord } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private repo;
    constructor(repo: UsersRepository);
    findAll(role?: string): UserRecord[];
    findOne(id: string): UserRecord;
    findByEmail(email: string): UserRecord | undefined;
    create(dto: CreateUserDto, password: string): UserRecord;
    update(id: string, dto: UpdateUserDto): UserRecord;
    updateStatus(id: string, status: string): UserRecord;
    incrementTxns(id: string): void;
    remove(id: string): void;
    getCustomers(): UserRecord[];
    getMerchants(): UserRecord[];
    getAdmins(): UserRecord[];
}
