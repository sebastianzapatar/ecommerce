import { IsEmail, IsString, MaxLength, MinLength,Matches } from "class-validator";

export class LoginAuthDto {

    @IsEmail()
    email:string;
    @IsString()
    @MinLength(8)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password:string;
    
}
