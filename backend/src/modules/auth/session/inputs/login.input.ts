import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional, IsString, Length, MinLength } from "class-validator";


@InputType()//modelul de date primite de la client
export class LoginInput {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    public login: string

    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    public password: string

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    @Length(6, 6)
    public pin?: string
}