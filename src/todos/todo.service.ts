import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User, ToDo as ToDoModel, Prisma, Status } from '@prisma/client'
import { PrismaService } from "prisma/prisma.service";


@Injectable()
export class TodoService {
    constructor(private readonly prismaService: PrismaService) { }

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

    async updateContent(id: Prisma.ToDoWhereUniqueInput, title: string, desc: string): Promise<ToDoModel | HttpException> {
        const res = this.prismaService.toDo.update({
            where: id,
            data: {
                title,
                desc
            }
        }).then(res => {
            return res
        }).catch(err => {
            console.log(err)
            const msg = err.meta ? err.meta.message : err
            throw new HttpException(msg, HttpStatus.BAD_REQUEST)
        })

        return res
    }


    async removeTodo(id: Prisma.ToDoWhereUniqueInput, userId: Prisma.UserWhereUniqueInput): Promise<ToDoModel[]> {
        let item = await this.prismaService.toDo.delete({ where: id })
        return this.findTodos({ where: userId })
    }

}