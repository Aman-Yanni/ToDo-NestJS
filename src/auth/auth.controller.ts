import { BadRequestException, Body, Controller, Get, HttpStatus, Post, Request, UseGuards, ValidationPipe } from "@nestjs/common";
import { User } from "@prisma/client";
import { AuthService } from "./auth.service";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { JwtAuthGuard } from "./guard/jwt-auth.guard";
import { LocalAuthGuard } from "./guard/local-auth.guard";


@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('/signup')
    async signUp(@Body(ValidationPipe) userData: AuthCredentialsDto): Promise<any> {
        const { username, email, password } = userData
        if (!email) {
            throw new BadRequestException("Email is required")
        }
        return await this.authService.signUp(userData)
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