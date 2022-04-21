import { BadRequestException, Body, ConsoleLogger, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, Req, Request, Response, UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { TodoService } from "./todo.service";
import { ToDo as TodoModel, Prisma, Status } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { response } from 'express';

@UseGuards(JwtAuthGuard)
@Controller("todos")
export class TodoController {
    constructor(private readonly todoService: TodoService, private readonly prismaService: PrismaService) { }


    @Post('/create')
    async createTodos(
        @Request() req,
        @Body() todoData: { title: string, desc: string, completion: any },
    ): Promise<any> {
        const { title, desc, completion } = todoData
        if (!title) {
            throw new HttpException("'Title' is required", HttpStatus.BAD_REQUEST)
        }
        else if (title && title === '') {
            throw new BadRequestException("'Title' cannot be empty")
        }
        else if (completion && !(completion in Status)) {
            throw new HttpException("invalid completion value", HttpStatus.BAD_REQUEST)
        }

        const res = await this.todoService.createTodo({
            title,
            desc,
            completion,
            user: {
                connect: {
                    userId: req.user.userId
                }
            }
        }).then(response => {
            // console.log(response)
            return response
        }).catch(err => {
            throw new HttpException(err, HttpStatus.BAD_REQUEST)
        });
        return {
            success: true,
            status: HttpStatus.OK,
            data: res
        }
    }


    @Get('/allById')
    async getUserTOdos(@Request() req): Promise<any> {
        const { userId } = req.user

        const res = await this.todoService.findTodos({ where: { userId } })
            .then(response => {
                return response
            })
            .catch(err => {
                throw new HttpException(err, HttpStatus.BAD_REQUEST)
            })
        return {
            success: true,
            status: HttpStatus.OK,
            data: res
        }
    }

    @Get('/search')
    async searchTodo(@Request() req, @Body() serachDto: { query: string }): Promise<any> {
        const { userId } = req.user;
        const { query } = serachDto;

        const res = await this.todoService.searchTodo({
            where: { userId }
        }, query).then(res => {
            return res
        }).catch(err => {
            throw new BadRequestException(err)
        })
        return {
            success: true,
            status: HttpStatus.OK,
            data: res
        }
    }

    @Get('/filter')
    async filterTodo(@Request() req, @Body(ValidationPipe) searchDto: { completion: Status }): Promise<any> {
        const { userId } = req.user;
        const { completion } = searchDto;
        if (completion && !(completion in Status)) {
            throw new HttpException("invalid completion value", HttpStatus.BAD_REQUEST)
        }
        const res = await this.todoService.filterTodo({
            where: { userId, completion }
        }).then(res => {
            return res
        }).catch(err => {
            throw new BadRequestException(err)
        })
        return {
            success: true,
            status: HttpStatus.OK,
            data: res
        }
    }


    @Patch('/updateCompletion')
    async updateCompletion(@Body() updateTodoDto: { id: string, completion: Status }): Promise<any> {
        const { id, completion } = updateTodoDto
        if (completion && !(completion in Status)) {
            throw new HttpException("invalid completion value", HttpStatus.BAD_REQUEST)
        }

        const res = await this.todoService.updateCompletion({ id }, completion).then(response => {
            // console.log(response)
            return response
        }).catch(err => {
            throw new HttpException(err, HttpStatus.BAD_REQUEST)
        });

        return {
            success: true,
            status: HttpStatus.OK,
            data: res
        }
    }

    @Patch('/updateContent')
    async udpateContent(@Body() updateTodoDto: { id: string, title: string, desc: string }): Promise<any> {
        const { id, title, desc } = updateTodoDto;
        if (!id) {
            throw new BadRequestException("'id' field is required")
        }
        if (id && typeof id !== "string") {
            throw new BadRequestException("'id' invalid type, must be type string")
        }
        else if (title && title.trim().length === 0) {
            throw new BadRequestException("'Title' cannot be empty")
        }
        const res = await this.todoService.updateContent({ id }, title ? title.trim() : title, desc).then(response => {
            // console.log(response)
            return response
        }).catch(err => {
            throw new HttpException(err, HttpStatus.BAD_REQUEST)
        });

        return {
            success: true,
            status: HttpStatus.OK,
            data: res
        }
    }



    @Post('/removeTodo')
    async removeTodo(@Request() req, @Body() removeTodoDto: { id: string }): Promise<any> {
        const { userId } = req.user
        const { id } = removeTodoDto
        const res = await this.todoService.removeTodo({ id }, { userId }).then(response => {
            // console.log(response)
            return response
        }).catch(err => {
            throw new HttpException(err, HttpStatus.BAD_REQUEST)
        });

        return {
            success: true,
            status: HttpStatus.OK,
            data: res
        }
    }
}