import { Body, Controller, Get, Post, Request, UseGuards, ValidationPipe } from "@nestjs/common";
import { CreateUserDto } from "src/users/dto/create.dto";
import { User } from "src/users/schemas/user.schema";
import { AuthService } from "./auth.service";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { JwtAuthGuard } from "./guard/jwt-auth.guard";
import { LocalAuthGuard } from "./guard/local-auth.guard";


@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('/signup')
    async signUp(@Body(ValidationPipe) createUserDto: AuthCredentialsDto): Promise<any> {
        return await this.authService.signUp(createUserDto);
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