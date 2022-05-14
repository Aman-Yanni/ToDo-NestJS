import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/user.service'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { User as UserModel } from '@prisma/client';
import * as dotenv from 'dotenv';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { use } from 'passport';

dotenv.config()
@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }


    async login(user: UserModel): Promise<any> {
        const payload = {
            user: {
                userId: user.userId,
                email: user.email,
                username: user.username
            },
            sub: user.userId,
        }

        return {
            email: user.email,
            username: user.username,
            access_token: this.jwtService.sign(payload),
        }
    }

    async verify(token: string): Promise<UserModel> {
        const decoded = this.jwtService.verify(token, { secret: process.env.JWT_TOKEN })
        const user = this.userService.getUserByUniqueValue({ email: decoded.user.email }) || this.userService.getUserByUniqueValue({ username: decoded.user.username })
        return user;
    }

    async signUp(userData: AuthCredentialsDto): Promise<{ access_token: string }> {
        const { username, email, password } = userData;
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await this.userService.createUser({ username, email, password: hashedPassword })

        return this.login(user).catch(err => { throw err })
    }

    async validateUser(usernameOrEmail: string, password: string): Promise<UserModel> {
        const user = await this.userService.getUserByUniqueValue({ email: usernameOrEmail }) || await this.userService.getUserByUniqueValue({ username: usernameOrEmail });
        if (!user) {
            throw new NotFoundException("User does not exist")
        }

        const valid = await bcrypt.compare(password, user.password)
        if (valid) {
            return user;
        }

        throw new UnauthorizedException("Password is invalid")
    }
}
