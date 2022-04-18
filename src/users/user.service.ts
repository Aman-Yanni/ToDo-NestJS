import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model, FilterQuery } from 'mongoose';
import { User, UserDoc } from "./schemas/user.schema";
import { UserRepo } from './user.repo';
import { v4 as uuidv4 } from 'uuid';
import { UpdateUserDto } from './dto/update.dto';
import { PrismaService } from 'prisma/prisma.service';
import { User as UserModel, Prisma } from '@prisma/client'

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDoc>, private readonly prismaService: PrismaService) { }



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
