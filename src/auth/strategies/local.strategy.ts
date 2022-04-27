import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({ usernameField: 'usernameOrEmail' })

    }


    async validate(usernameOrEmail: string, password: string): Promise<any> {
        if (!usernameOrEmail) {
            throw new BadRequestException("Username or password is required")
        }
        if (!password) {
            throw new BadRequestException("Password is required")
        }
        const user = await this.authService.validateUser(usernameOrEmail, password);

        if (!user) {
            throw new UnauthorizedException("Invalid Credentials")
        }
        return user;
    }
}