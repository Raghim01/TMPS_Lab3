import { IsEmail, IsString, Matches, MaxLength, MinLength, isEmail } from "class-validator";

export class AuthCredentialsDto {

    @IsEmail()
    mail: string;

    @IsString()
    @MinLength(3)
    @MaxLength(20)
    username: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        { message: 'password is too weak' })
    password: string;
}