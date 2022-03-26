import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { ToDo, TodoSchema } from './schemas/todo.schema';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: ToDo.name, schema: TodoSchema }]),
    ],
    controllers: [TodoController],
    providers: [TodoService, JwtStrategy],
})
export class TodoModule { }
