import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { PrismaModule } from 'prisma/prisma.module';
import { UsersController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [
        PrismaModule
    ],
    controllers: [UsersController],
    providers: [UserService, JwtStrategy],
    exports: [UserService]
})
export class UserModule { }
