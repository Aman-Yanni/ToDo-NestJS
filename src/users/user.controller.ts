import { BadRequestException, Body, ConsoleLogger, Controller, Get, HttpStatus, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel, Prisma } from '@prisma/client'
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { MaxLength, MinLength } from 'class-validator';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UserService,
    ) { }


    @Post('/create')
    async createUser(
        @Body() userData: { username: string; email: string, password: string },
    ): Promise<UserModel> {
        const data = { username: userData.username.trim(), email: userData.username.trim().toLowerCase, password: userData.password.trim() }

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
        const { password } = userUpdatePass
        if (!password) {
            throw new BadRequestException("Password cannot be empty")
        }
        else if (password.length < 8) {
            throw new BadRequestException("Password is too short (8 characters min)")
        }
        else if (password.length > 32) {
            throw new BadRequestException("Password is too long (32 characters max)")
        }
        return this.usersService.updatePass({ userId }, userUpdatePass.password);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/updateUsername')
    async updateUsername(
        @Request() req,
        @Body() updateUserDto: { username: string },
    ): Promise<any> {
        const { userId } = req.user
        if (!updateUserDto.username) {
            throw new BadRequestException("Username is required")
        }
        return await this.usersService.updateUser({ userId }, updateUserDto.username)
            .then(res => {
                return {
                    success: true,
                    status: HttpStatus.OK,
                    data: req.user
                }
            }).catch(err => {
                throw new BadRequestException(err)
            });
    }


}
