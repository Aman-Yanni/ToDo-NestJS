import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

@Module({
    imports: [
        PrismaModule
    ],
    controllers: [TodoController],
    providers: [TodoService, JwtStrategy],
})
export class TodoModule { }
