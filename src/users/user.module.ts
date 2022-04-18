import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { PrismaModule } from 'prisma/prisma.module';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './user.controller';
import { UserRepo } from './user.repo';
import { UserService } from './user.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        PrismaModule
    ],
    controllers: [UsersController],
    providers: [UserService, JwtStrategy],
    exports: [UserService]
})
export class UserModule { }
