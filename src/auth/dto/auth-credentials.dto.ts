
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";


export class AuthCredentialsDto {
    username?: string;

    @IsEmail()
    email: string;

    // @IsString();
    @MinLength(8, { message: "Password is too short (8 characters min)" })
    @MaxLength(32, { message: "Password is too long(32 charcaters max)" })
    password: string;
}