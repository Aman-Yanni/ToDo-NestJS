import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ToDo, TodoDoc } from "./schemas/todo.schema";
import { Model } from "mongoose"
import { v4 as uuid } from 'uuid'
import { User, ToDo as ToDoModel, Prisma, Status } from '@prisma/client'
import { PrismaService } from "prisma/prisma.service";


@Injectable()
export class TodoService {
    constructor(@InjectModel(ToDo.name) private todoModel: Model<TodoDoc>, private readonly prismaService: PrismaService) { }

    async createTodo(data: Prisma.ToDoCreateInput): Promise<ToDoModel> {
        return this.prismaService.toDo.create({
            data,
        });
    }

    async findTodos(params: {
        where?: Prisma.UserWhereInput;
    }): Promise<ToDoModel[]> {
        const { where } = params;
        return this.prismaService.toDo.findMany({
            where,
        });
    }


    async updateCompletion(id: Prisma.ToDoWhereUniqueInput, completion: Status): Promise<ToDoModel> {
        return this.prismaService.toDo.update({
            where: id,
            data: {
                completion
            }
        })
    }

    async updateContent(id: Prisma.ToDoWhereUniqueInput, title: string, desc: string): Promise<ToDoModel> {
        return this.prismaService.toDo.update({
            where: id,
            data: {
                title,
                desc
            }
        })
    }


    async removeTodo(id: Prisma.ToDoWhereUniqueInput, userId: Prisma.UserWhereUniqueInput): Promise<ToDoModel[]> {
        let item = await this.prismaService.toDo.delete({ where: id })
        return this.findTodos({ where: userId })
    }

}