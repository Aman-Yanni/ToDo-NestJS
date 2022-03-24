import { Body, ConsoleLogger, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateTodoDto } from "./dto/create.dto";
import { ToDo } from "./schemas/todo.schema";
import { TodoService } from "./todo.service";


@Controller("todos")
export class TodoController {
    constructor(private readonly todoService: TodoService) { }

    @Post()
    async createTodo(@Body() createDto: CreateTodoDto): Promise<ToDo> {
        return this.todoService.createTodo(
            createDto.userId,
            createDto.content
        )
    }

    @Patch('update-completion')
    async updateCompletion(@Body() updateTodoDto: { id: string, completion: boolean }): Promise<ToDo> {
        return this.todoService.updateCompletion(updateTodoDto.id, updateTodoDto.completion)
    }

    @Get(':userId')
    async getUserTodos(@Param('userId') userId: string): Promise<ToDo[]> {
        return this.todoService.findTodos(userId)
    }
}