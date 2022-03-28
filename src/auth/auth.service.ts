import { Injectable } from '@nestjs/common';
import { UserService } from '../users/user.service'
import { JwtService } from '@nestjs/jwt'
import { User } from 'src/users/schemas/user.schema';
import { jwtSecret } from './config';
import { CreateUserDto } from 'src/users/dto/create.dto';
import * as bcrypt from 'bcrypt'
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }

    async validate(email: string, password: string): Promise<User> {
        const user = this.userService.getUserByEmail(email)

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

    async login(user: User): Promise<{ access_token: string }> {
        const payload = {
            username: user,
            sub: user.userId
        }

        return {
            access_token: this.jwtService.sign(payload),
        }
    }

    async verify(token: string): Promise<User> {
        const decoded = this.jwtService.verify(token, { secret: jwtSecret })

        const user = this.userService.getUserByEmail(decoded.email)
        return user;
    }

    async signUp(userCreateDto: AuthCredentialsDto): Promise<{ access_token: string }> {
        const { username, password } = userCreateDto;

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await this.userService.createUser(username, hashedPassword)

        return this.login(user).catch(err => { throw err })
    }

    async validateUser(username: string, password: string): Promise<User> {
        const user = await this.userService.getUserByUsername(username);
        if (!user) {
            return null
        }

        const valid = await bcrypt.compare(password, user.password)
        if (valid) {
            return user;
        }

        return null
    }


}
