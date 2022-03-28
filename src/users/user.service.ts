import { ConflictException, Injectable } from '@nestjs/common';
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

    async getUserByEmail(email: string): Promise<User> {
        return await (this.userModel.findOne({ email }))
    }

    async getUserByUsername(username: string): Promise<User> {
        return await (this.userModel.findOne({ username }))
    }

    async getUsers(): Promise<User[]> {
        return this.userModel.find({});
    }

    async createUser(username: string, password: string): Promise<User> {
        const newUser = new this.userModel({
            userId: uuidv4(),
            // email,
            username,
            password,
        });
        return newUser.save().catch((err) => {
            console.log(err.code)
            if (err.code === 11000) {
                throw new ConflictException("User already exists")
            }
            throw err
        });
    }

    async updateUser(userId: string, username: string): Promise<User> {
        return this.userModel.findOneAndUpdate({ userId }, { username })
            .setOptions({ new: true })
    }

    async checkPass(userId: string): Promise<string> {
        return (await this.userModel.findOne({ userId }))["password"];
    }

    async updatePass(userId: string, password: string): Promise<User> {
        return this.userModel.findOneAndUpdate({ userId }, { password })
            .setOptions({ new: true })
    }
}
