import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ToDo, TodoSchema } from './schemas/todo.schema';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: ToDo.name, schema: TodoSchema }]),
    ],
    controllers: [TodoController],
    providers: [TodoService],
})
export class TodoModule { }
