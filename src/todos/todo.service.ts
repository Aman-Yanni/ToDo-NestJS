import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ToDo, TodoDoc } from "./schemas/todo.schema";
import { Model } from "mongoose"
import { v4 as uuid } from 'uuid'


@Injectable()
export class TodoService {
    constructor(@InjectModel(ToDo.name) private todoModel: Model<TodoDoc>) { }

    async createTodo(userId: string, content: string): Promise<ToDo> {
        const todo = new this.todoModel({
            id: uuid(),
            content: content,
            completion: false,
            userId: userId
        });
        return todo.save();
    }

    async updateCompletion(id: string, completion: boolean): Promise<ToDo> {
        return this.todoModel.findOneAndUpdate({ id }, { completion })
            .setOptions({ new: true })
    }

    async findTodos(userId: string): Promise<ToDo[]> {
        return this.todoModel.find({ userId })

    }

}