import { UserService } from './user.service';
import { User } from './user.entity';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User>;
    create(userData: Partial<User>): Promise<User>;
    update(id: number, userData: Partial<User>): Promise<User>;
    remove(id: number): Promise<void>;
}
