import { Body, ConsoleLogger, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create.dto';
import { UpdateUserDto } from './dto/update.dto';

import { User } from './schemas/user.schema';
import { UserService } from './user.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UserService) { }

    @Get(':userId')
    async getUser(@Param('userId') userId: string): Promise<User> {
        return this.usersService.getUserById(userId);
    }

    @Get()
    async getUsers(): Promise<User[]> {
        console.log("check")
        return this.usersService.getUsers();
    }

    @Get('/check-pass/:userId')
    async checkPass(@Param('userId') userId: string): Promise<User> {
        const password = await (this.usersService.checkPass(userId));
        console.log(password)
        return password
        // if (user["password"]) {
        //     return user["password"]
        // }
        // else {
        //     return "add a password"
        // }
    }

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.usersService.createUser(
            createUserDto.email,
            createUserDto.username,
            createUserDto.password,
        );
    }

    @Patch(':userId')
    async updateUser(
        @Param('userId') userId: string,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<User> {
        console.log(updateUserDto)
        return this.usersService.updateUser(userId, updateUserDto);
    }

    @Patch('/update-pass')
    async updatePass(@Body() userUpdatePass: {
        id: string,
        password: string
    }): Promise<User> {
        console.log(userUpdatePass)
        return this.usersService.updatePass(userUpdatePass.id, userUpdatePass.password);
    }
}
