import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { User as UserModel, Prisma } from '@prisma/client'

import * as bcrypt from 'bcrypt'
@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) { }



    async getUsers(params: {
        where?: Prisma.UserWhereInput;
    }): Promise<UserModel[]> {
        const { where } = params;
        return await this.prismaService.user.findMany({ where });
    }

    async createUser(data: Prisma.UserCreateInput): Promise<UserModel> {

        return await this.prismaService.user.create({
            data,
        }).catch(err => {
            console.log(err)
            throw err
        });
    }


    async getUserByUniqueValue(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<UserModel | null> {
        return await (this.prismaService.user.findUnique({ where: userWhereUniqueInput }))

    }


    async updateUser(userId: Prisma.UserWhereUniqueInput, username: string): Promise<UserModel> {
        return await this.prismaService.user.update({
            where: userId,
            data: { username }
        })
    }


    async updatePass(userId: Prisma.UserWhereUniqueInput, password: string): Promise<UserModel> {
        const newPass = await bcrypt.hash(password, 10)

        return await this.prismaService.user.update({
            where: userId,
            data: { password: newPass }
        })
    }
}
