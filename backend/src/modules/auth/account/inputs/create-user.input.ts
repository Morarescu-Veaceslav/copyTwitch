import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

@InputType() //definește ce primim de la client (input)
export class CreateUserInput {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-zA-A0-9]+(?:-[a-zA-A0-9]+)*$/)
    public username: string

    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    public email: string

    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    public password: string
}