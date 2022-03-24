import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, FilterQuery } from 'mongoose';
import { User, UserDoc } from "./schemas/user.schema";

@Injectable()
export class UserRepo {
    constructor(@InjectModel(User.name) private userModel: Model<UserDoc>) { }

    async findOne(userFilterQuery: FilterQuery<User>): Promise<User> {
        return this.userModel.findOne(userFilterQuery)
    }

    async find(userFilterQuery: FilterQuery<User>): Promise<User[]> {
        return this.userModel.find(userFilterQuery)
    }

    async create(user: User): Promise<User> {
        const newUser = new this.userModel(user);
        return newUser.save();
    }

    async updateUser(userFilterQuery: FilterQuery<User>, user: Partial<User>): Promise<User> {
        return this.userModel.findOneAndUpdate(userFilterQuery, user)
    }

    async checkPass(userFilterQuery: FilterQuery<User>): Promise<User> {
        return this.userModel.findOne(userFilterQuery)
    }

    async updatePass(userFilterQuery: FilterQuery<User>, user: Partial<User>): Promise<User> {
        return this.userModel.findOneAndUpdate(userFilterQuery, user)
    }
}