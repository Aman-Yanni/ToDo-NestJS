import { Body, Controller, Get, Post, Request, UseGuards, ValidationPipe } from "@nestjs/common";
import { User } from "@prisma/client";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guard/jwt-auth.guard";
import { LocalAuthGuard } from "./guard/local-auth.guard";


@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('/signup')
    async signUp(@Body(ValidationPipe) userData: { username: string; email: string, password: string }): Promise<any> {
        return await this.authService.signUp(userData);
    }

    @UseGuards(LocalAuthGuard)
    @Post('signin')
    async signIn(@Request() req): Promise<any> {
        return this.authService.login(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getMe(@Request() req): Promise<User> {
        return req.user;
    }
}