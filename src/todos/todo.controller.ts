import { Body, ConsoleLogger, Controller, Get, Param, Patch, Post, Req, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateTodoDto } from "./dto/create.dto";
import { ToDo } from "./schemas/todo.schema";
import { TodoService } from "./todo.service";


@Controller("todos")
export class TodoController {
    constructor(private readonly todoService: TodoService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createTodo(@Request() req, @Body() createDto: CreateTodoDto): Promise<ToDo> {
        return this.todoService.createTodo(
            req.user.userId,
            createDto.content
        )
    }

    @UseGuards(JwtAuthGuard)
    @Patch('update-completion')
    async updateCompletion(@Body() updateTodoDto: { id: string, completion: boolean }): Promise<ToDo> {
        return this.todoService.updateCompletion(updateTodoDto.id, updateTodoDto.completion)
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getUserTodos(@Request() req): Promise<ToDo[]> {
        return this.todoService.findTodos(req.user.userId)
    }
}