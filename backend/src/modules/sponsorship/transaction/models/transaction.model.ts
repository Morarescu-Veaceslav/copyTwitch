import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { TransactionStatus, type $Enums, type Transaction } from "@prisma/generated";
import { IsNotEmpty, IsString } from "class-validator";
import { UserModel } from "src/modules/auth/account/models/user.model";

registerEnumType(TransactionStatus, { name: 'TransactionStatus' })

@ObjectType()
export class TransactionModel implements Transaction {

    @Field(() => ID)
    public id: string;

    @Field(() => Number)
    public amount: number;

    @Field(() => String)
    public currency: string;

    @Field(() => String, { nullable: true })
    public stripeSubscriptionId: string;

    @Field(() => TransactionStatus)
    public status: TransactionStatus;

    @Field(() => UserModel)
    public user: UserModel

    @Field(() => String)
    public userId: string;

    @Field(() => Date)
    public updatedAt: Date;

    @Field(() => Date)
    public createdAt: Date;
}
