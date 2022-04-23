import { Injectable } from '@nestjs/common';
import { UserService } from '../users/user.service'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { User as UserModel } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config()
@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }

    async validate(usernameOrEmail: string, password: string): Promise<UserModel> {
        // const user = this.userService.getUserByUniqueValue({ })
        const user = this.userService.getUserByUniqueValue({ username: usernameOrEmail }) || this.userService.getUserByUniqueValue({ email: usernameOrEmail });

        if (!user) {
            return null
        }
        if (user && password === (await user).password) {
            return user
        }
        else {
            return null
        }
    }

    async login(user: UserModel): Promise<any> {
        const payload = {
            user: user,
            sub: user.userId
        }

        return {
            email: user.email,
            username: user.username,
            access_token: this.jwtService.sign(payload),
        }
    }

    async verify(token: string): Promise<UserModel> {
        const decoded = this.jwtService.verify(token, { secret: process.env.JWT_TOKEN })
        console.log('decoded')
        console.log(decoded)
        const user = this.userService.getUserByUniqueValue({ email: decoded.user.email }) || this.userService.getUserByUniqueValue({ username: decoded.user.username })
        return user;
    }

    async signUp(userData: { username: string; email: string, password: string }): Promise<{ access_token: string }> {
        const { username, email, password } = userData;

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await this.userService.createUser({ username, email, password: hashedPassword })

        return this.login(user).catch(err => { throw err })
    }

    async validateUser(usernameOrEmail: string, password: string): Promise<UserModel> {
        const user = await this.userService.getUserByUniqueValue({ email: usernameOrEmail }) || await this.userService.getUserByUniqueValue({ username: usernameOrEmail });
        console.log(user)
        if (!user) {
            return null
        }

        const valid = await bcrypt.compare(password, user.password)
        console.log(valid)
        if (valid) {
            return user;
        }

        return null
    }
}
