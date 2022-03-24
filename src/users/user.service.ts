import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model, FilterQuery } from 'mongoose';
import { User, UserDoc } from "./schemas/user.schema";
import { UserRepo } from './user.repo';
import { v4 as uuidv4 } from 'uuid';
import { UpdateUserDto } from './dto/update.dto';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDoc>) { }

    async getUserById(userId: string): Promise<User> {
        return await (this.userModel.findOne({ userId }))
    }

    async getUsers(): Promise<User[]> {
        return this.userModel.find({});
    }

    async createUser(email: string, username: string, password: string): Promise<User> {
        const newUser = new this.userModel({
            userId: uuidv4(),
            email,
            username,
            password,
        });
        return newUser.save();
    }

    async updateUser(userId: string, userUpdates: UpdateUserDto): Promise<User> {
        console.log(userUpdates, " ", userId)
        return this.userModel.findOneAndUpdate({ userId }, userUpdates)
            .setOptions({ new: true })
    }

    async checkPass(userId: string): Promise<User> {
        console.log(userId)
        return (await this.userModel.findOne({ userId }));
    }

    async updatePass(userId: string, password: string): Promise<User> {

        console.log(userId, " ", password)
        return this.userModel.findOneAndUpdate({ userId }, { password })
            .setOptions({ new: true })
    }
}
