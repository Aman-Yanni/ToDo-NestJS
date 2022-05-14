import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User, ToDo as ToDoModel, Prisma, Status } from '@prisma/client'
import { PrismaService } from "prisma/prisma.service";


@Injectable()
export class TodoService {
    constructor(private readonly prismaService: PrismaService) { }

    async createTodo(data: Prisma.ToDoCreateInput): Promise<ToDoModel> {
        return await this.prismaService.toDo.create({
            data,
        });
    }

    async findTodo(params: { where?: Prisma.ToDoWhereUniqueInput }): Promise<ToDoModel> {
        const { where } = params;
        return await this.prismaService.toDo.findUnique({ where })
    }

    async findTodos(params: {
        where?: Prisma.UserWhereInput;
    }): Promise<ToDoModel[]> {
        const { where } = params;
        return this.prismaService.toDo.findMany({
            where,
        });
    }

    async searchTodo(params: {
        where?: Prisma.ToDoWhereInput;
    }, query): Promise<ToDoModel[]> {
        const { where } = params
        let list = []
        await this.prismaService.toDo.findMany({ where })
            .then(res => {
                res.forEach(item => {
                    if (item.title.toLowerCase().includes(query.toLowerCase()) || item.desc.toLowerCase().includes(query.toLowerCase())) {
                        list.push(item)
                    }
                })
            }).catch(err => {
                throw new BadRequestException(err)
            })

        return list
    }

    async filterTodo(params: {
        where?: Prisma.ToDoWhereInput
    }): Promise<ToDoModel[]> {
        const { where } = params
        let list = await this.prismaService.toDo.findMany({ where })
            .then(res => {
                return res
            }).catch(err => {
                throw new BadRequestException(err)
            })

        return list
    }

    async updateCompletion(id: Prisma.ToDoWhereUniqueInput, completion: Status): Promise<ToDoModel> {
        return await this.prismaService.toDo.update({
            where: id,
            data: {
                completion
            }
        }).then(res => {
            return res
        }).catch(err => {
            const msg = err.meta ? err.meta.message : err
            throw new HttpException(msg, HttpStatus.BAD_REQUEST)
        })
    }

    async updateContent(id: Prisma.ToDoWhereUniqueInput, title: string, desc: string): Promise<ToDoModel> {
        const res = await this.prismaService.toDo.update({
            where: id,
            data: {
                title,
                desc
            }
        }).then(res => {
            return res
        }).catch(err => {
            const msg = err.meta ? err.meta.message : err
            throw new HttpException(msg, HttpStatus.BAD_REQUEST)
        })

        return res
    }


    async removeTodo(id: Prisma.ToDoWhereUniqueInput, userId: Prisma.UserWhereUniqueInput): Promise<ToDoModel[]> {
        let item = await this.prismaService.toDo.delete({ where: id })
        return await this.findTodos({ where: userId })
    }

}