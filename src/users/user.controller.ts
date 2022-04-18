import { Body, ConsoleLogger, Controller, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create.dto';
import { UpdateUserDto } from './dto/update.dto';

import { User } from './schemas/user.schema';
import { UserService } from './user.service';
import { User as UserModel, Prisma } from '@prisma/client'
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UserService,
    ) { }


    @Post('/create')
    async createUser(
        @Body() userData: { username: string; email: string, password: string },
    ): Promise<UserModel> {
        return this.usersService.createUser(userData);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/all')
    async getUsers(): Promise<UserModel[]> {
        return this.usersService.getUsers({})
    }

    @UseGuards(JwtAuthGuard)
    @Get('/byId')
    async getUser(@Request() req): Promise<UserModel> {
        const { userId } = req.user
        return this.usersService.getUserByUniqueValue({ userId })
    }


    @UseGuards(JwtAuthGuard)
    @Patch('/updatePass')
    async updatePass(@Request() req, @Body() userUpdatePass: {
        password: string
    }): Promise<UserModel> {
        const { userId } = req.user

        return this.usersService.updatePass({ userId }, userUpdatePass.password);
    }

    @Patch('/updateUsername')
    async updateUsername(
        @Request() req,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<UserModel> {
        const { userId } = req.user
        return this.usersService.updateUser({ userId }, updateUserDto.username);
    }


}
