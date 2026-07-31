import { UsersService } from './users.service';
import type { UserRecord } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    login(body: {
        email: string;
    }, password: string): {
        success: boolean;
        user?: Partial<UserRecord>;
        message?: string;
    };
    findAll(role?: string): UserRecord[];
    findCustomers(): UserRecord[];
    findMerchants(): UserRecord[];
    findOne(id: string): UserRecord;
    create(dto: CreateUserDto, password: string): UserRecord;
    update(id: string, dto: UpdateUserDto): UserRecord;
    updateStatus(id: string, status: string): UserRecord;
    remove(id: string): {
        message: string;
    };
}
