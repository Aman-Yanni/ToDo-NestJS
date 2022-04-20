import { BadRequestException, Body, ConsoleLogger, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, Req, Request, Response, UseGuards } from '@nestjs/common';
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

        const res = this.todoService.createTodo({
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
            return {
                success: true,
                status: HttpStatus.OK,
                data: response
            }
        }).catch(err => {
            throw new HttpException(err, HttpStatus.BAD_REQUEST)
        });
        return res
    }


    @Get('/allById')
    async getUserTOdos(@Request() req): Promise<any> {
        const { userId } = req.user

        const res = this.todoService.findTodos({ where: { userId } })
            .then(response => {
                // console.log(response)
                return {
                    success: true,
                    status: HttpStatus.OK,
                    data: response
                }
            })
            .catch(err => {
                throw new HttpException(err, HttpStatus.BAD_REQUEST)
            })
        return res
    }

    @Get('/search')
    async searchTodo() { }


    @Patch('/updateCompletion')
    async updateCompletion(@Body() updateTodoDto: { id: string, completion: Status }): Promise<any> {
        const { id, completion } = updateTodoDto
        if (completion && !(completion in Status)) {
            throw new HttpException("invalid completion value", HttpStatus.BAD_REQUEST)
        }

        const res = this.todoService.updateCompletion({ id }, completion).then(response => {
            // console.log(response)
            return {
                success: true,
                status: HttpStatus.OK,
                data: response
            }
        }).catch(err => {
            throw new HttpException(err, HttpStatus.BAD_REQUEST)
        });

        return res
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
        const res = this.todoService.updateContent({ id }, title ? title.trim() : title, desc).then(response => {
            // console.log(response)
            return {
                success: true,
                status: HttpStatus.OK,
                data: response
            }
        }).catch(err => {
            throw new HttpException(err, HttpStatus.BAD_REQUEST)
        });

        return res
    }



    @Post('/removeTodo')
    async removeTodo(@Request() req, @Body() removeTodoDto: { id: string }): Promise<any> {
        const { userId } = req.user
        const { id } = removeTodoDto
        const res = this.todoService.removeTodo({ id }, { userId }).then(response => {
            // console.log(response)
            return {
                success: true,
                status: HttpStatus.OK,
                data: response
            }
        }).catch(err => {
            throw new HttpException(err, HttpStatus.BAD_REQUEST)
        });

        return res
    }
}