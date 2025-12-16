import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";


@InputType() // definește structura datelor primite de la client
export class ResetPasswordInput {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    public email: string
}