import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Category } from "@prisma/generated";
import { StreamModel } from "src/modules/stream/models/stream.module";


@ObjectType()
export class CategoryModel implements Category {
    @Field(() => ID)
    public id: string

    @Field(() => String)
    public title: string;

    @Field(() => String)
    public slug: string;

    @Field(() => String, { nullable: true })
    public description: string | null;

    @Field(() => String, { nullable: true })
    public thumbnailUrl: string | null;

    @Field(() => [StreamModel])
    public streams: StreamModel[]

    @Field(() => Date)
    public updatedAt: Date;

    @Field(() => Date)
    public createdAt: Date;
}