"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("./users.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    login(body, password) {
        const user = this.usersService.findByEmail(body.email);
        if (!user || user.password !== password) {
            return { success: false, message: 'Invalid credentials' };
        }
        return {
            success: true,
            user: { id: user.id, email: user.email, role: user.role, status: user.status, vpa: user.vpa, name: user.name },
        };
    }
    findAll(role) {
        return this.usersService.findAll(role);
    }
    findCustomers() { return this.usersService.getCustomers(); }
    findMerchants() { return this.usersService.getMerchants(); }
    findOne(id) { return this.usersService.findOne(id); }
    create(dto, password) {
        return this.usersService.create(dto, password);
    }
    update(id, dto) {
        return this.usersService.update(id, dto);
    }
    updateStatus(id, status) {
        return this.usersService.updateStatus(id, status);
    }
    remove(id) {
        this.usersService.remove(id);
        return { message: `User #${id} deleted` };
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Login (returns user for role-based routing, no auth token)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Object)
], UsersController.prototype, "login", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin', 'superuser', 'merchant', 'customer'),
    (0, swagger_1.ApiOperation)({ summary: 'List all users' }),
    (0, swagger_1.ApiQuery)({ name: 'role', required: false, enum: ['customer', 'merchant', 'admin', 'superuser'] }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Users list returned' }),
    __param(0, (0, common_1.Query)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Array)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('customers'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'List all customers' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], UsersController.prototype, "findCustomers", null);
__decorate([
    (0, common_1.Get)('merchants'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'List all merchants' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], UsersController.prototype, "findMerchants", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new user' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'User created' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto, String]),
    __metadata("design:returntype", Object)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Object)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, roles_decorator_1.Roles)('admin', 'superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user status (freeze/unfreeze)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Object)
], UsersController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('superuser'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete user' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], UsersController.prototype, "remove", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map