import { Body, ConsoleLogger, Controller, Get, Param, Patch, Post, Req, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateTodoDto } from "./dto/create.dto";
import { ToDo } from "./schemas/todo.schema";
import { TodoService } from "./todo.service";
import { ToDo as TodoModel, Prisma, Status } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@UseGuards(JwtAuthGuard)
@Controller("todos")
export class TodoController {
    constructor(private readonly todoService: TodoService, private readonly prismaService: PrismaService) { }


    @Post('/create')
    async createTodos(
        @Request() req,
        @Body() todoData: { title: string, desc: string, completion: any },
    ): Promise<TodoModel> {
        const { title, desc, completion } = todoData
        return this.todoService.createTodo({
            title,
            desc,
            completion,
            user: {
                connect: {
                    userId: req.user.userId
                }
            }
        });
    }


    @Get('/allById')
    async getUserTOdos(@Request() req): Promise<TodoModel[]> {
        const { userId } = req.user
        return this.todoService.findTodos({ where: { userId } })
    }



    @Patch('/updateCompletion')
    async updateCompletion(@Body() updateTodoDto: { id: string, completion: Status }): Promise<TodoModel> {
        const { id, completion } = updateTodoDto
        return this.todoService.updateCompletion({ id }, completion)
    }

    @Patch('/updateContent')
    async udpateContent(@Body() updateTodoDto: { id: string, title: string, desc: string }): Promise<TodoModel> {
        const { id, title, desc } = updateTodoDto;
        return this.todoService.updateContent({ id }, title, desc)
    }

    @Post('/removeTodo')
    async removeTodo(@Request() req, @Body() removeTodoDto: { id: string }): Promise<TodoModel[]> {
        const { userId } = req.user
        const { id } = removeTodoDto
        return this.todoService.removeTodo({ id }, { userId })
    }
}