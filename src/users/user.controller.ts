import { Body, ConsoleLogger, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create.dto';
import { UpdateUserDto } from './dto/update.dto';

import { User } from './schemas/user.schema';
import { UserService } from './user.service';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UserService
    ) { }

    @Get('/check-pass/:userId')
    async checkPass(@Param('userId') userId: string): Promise<string> {
        const password = await (this.usersService.checkPass(userId));
        console.log(password)
        if (password) {
            return password
        }
        else {
            return "add a password"
        }
    }

    @Get(':userId')
    async getUser(@Param('userId') userId: string): Promise<User> {
        return this.usersService.getUserById(userId);
    }

    @Get()
    async getUsers(): Promise<User[]> {
        return this.usersService.getUsers();
    }



    @Post()
    async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.usersService.createUser(
            // createUserDto.email,
            createUserDto.username,
            createUserDto.password,
        );
    }

    @Patch('/update-pass')
    async updatePass(@Body() userUpdatePass: {
        userId: string,
        password: string
    }): Promise<User> {
        return this.usersService.updatePass(userUpdatePass.userId, userUpdatePass.password);
    }

    @Patch('/:userId')
    async updateUser(
        @Param('userId') userId: string,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<User> {
        return this.usersService.updateUser(userId, updateUserDto.username);
    }


}
