import { BadRequestException, Body, Controller, ForbiddenException, Get, HttpException, HttpStatus, Post, Request, UseGuards, ValidationPipe } from "@nestjs/common";
import { User } from "@prisma/client";
import { UserService } from "src/users/user.service";
import { AuthService } from "./auth.service";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { JwtAuthGuard } from "./guard/jwt-auth.guard";
import { LocalAuthGuard } from "./guard/local-auth.guard";


@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService, private readonly userService: UserService) { }

    @Post('/signup')
    async signUp(@Body(ValidationPipe) userData: AuthCredentialsDto): Promise<any> {
        const { username, email, password } = userData
        const data = { username: userData.username.trim(), email: userData.email.trim().toLowerCase(), password: userData.password.trim() }
        if (!email) {
            throw new BadRequestException("Email is required")
        }
        if (!username) {
            throw new BadRequestException("Username is required")
        }
        if (!password) {
            throw new BadRequestException("Password cannot be empty")
        }
        const user = await this.userService.getUserByUniqueValue({ email: email.trim().toLowerCase() })
        if (user) {
            throw new ForbiddenException("User already exists, please login")
        }
        else if (!user && username && await this.userService.getUserByUniqueValue({ username: email.trim() })) {
            throw new ForbiddenException("Username is taken")
        }
        return await this.authService.signUp(data)
            .then(res => {
                return {
                    success: true,
                    status: HttpStatus.OK,
                    data: res
                }
            }).catch(err => {
                throw new BadRequestException(err)
            });
    }

    @UseGuards(LocalAuthGuard)
    @Post('signin')
    async signIn(@Request() req): Promise<any> {

        return await this.authService.login(req.user)
            .then(res => {
                return {
                    success: true,
                    status: HttpStatus.OK,
                    data: res
                }
            }).catch(err => {
                throw new BadRequestException(err)
            });;
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getMe(@Request() req): Promise<User> {
        return req.user;
    }
}