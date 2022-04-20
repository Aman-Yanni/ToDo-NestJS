import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { User as UserModel, Prisma } from '@prisma/client'

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) { }



    async getUsers(params: {
        where?: Prisma.UserWhereInput;
    }): Promise<UserModel[]> {
        const { where } = params;
        return this.prismaService.user.findMany({ where });
    }

    async createUser(data: Prisma.UserCreateInput): Promise<UserModel> {
        return this.prismaService.user.create({
            data,
        });
    }


    async getUserByUniqueValue(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<UserModel | null> {
        return await (this.prismaService.user.findUnique({ where: userWhereUniqueInput }))
    }


    async updateUser(userId: Prisma.UserWhereUniqueInput, username: string): Promise<UserModel> {
        return this.prismaService.user.update({
            where: userId,
            data: { username }
        })
    }


    async updatePass(userId: Prisma.UserWhereUniqueInput, password: string): Promise<UserModel> {
        return this.prismaService.user.update({
            where: userId,
            data: { password }
        })
    }
}
