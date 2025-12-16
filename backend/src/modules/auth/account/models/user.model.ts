import { Field, ID, ObjectType } from "@nestjs/graphql";
import type { User } from "@prisma/generated";
import { SocialLinkModel } from "../../profile/models/social-link.model";
import { StreamModel } from "src/modules/stream/models/stream.module";
import { FollowModel } from "src/modules/follow/model/follow.model";
import { NotificationModel } from "src/modules/notification/models/notification.model";
import { NotificationSettingsModel } from "src/modules/notification/models/notification-settings.model";
import { PlanModel } from "src/modules/sponsorship/plan/models/plan.model";
import { SubscriptionModel } from "src/modules/sponsorship/subscription/models/subscription.model";

@ObjectType() //definește ce trimitem clientului (output).
export class UserModel implements User {

    @Field(() => ID)
    public id: string

    @Field(() => String)
    public email: string

    @Field(() => String)
    public password: string

    @Field(() => String)
    public username: string

    @Field(() => String)
    public displayName: string

    @Field(() => String, { nullable: true })
    public avatar: string | null;

    @Field(() => String, { nullable: true })
    public avatarMimeType: string | null;

    @Field(() => String, { nullable: true })
    public bio: string | null

    @Field(() => String, { nullable: true })
    public telegramId: string | null;

    @Field(() => Boolean)
    public isVerified: boolean

    @Field(() => Boolean)
    public isEmailVerified: boolean

    @Field(() => Boolean)
    public isTotpEnabled: boolean;

    @Field(() => String, { nullable: true })
    public totpSecret: string | null;

    @Field(() => Boolean)
    public isDeactivated: boolean;

    @Field(() => Date, { nullable: true })
    public deactivatedAt: Date | null;

    @Field(() => [SocialLinkModel])
    public socialLinks: SocialLinkModel[]

    @Field(() => [FollowModel])
    public followers: FollowModel[]

    @Field(() => [FollowModel])
    public followings: FollowModel[]

    @Field(() => StreamModel)
    public stream: StreamModel

    @Field(() => [NotificationModel])
    public notifications: NotificationModel[]

    @Field(() => NotificationSettingsModel, { nullable: true })
    public notificationSettings: NotificationSettingsModel

    @Field(() => [PlanModel])
    public sponsorshipPlans: PlanModel[]

    @Field(() => [SubscriptionModel])
    public sponsorshipSubscription: SubscriptionModel[]

    @Field(() => Date)
    public createdAt: Date

    @Field(() => Date)
    public updatedAt: Date

}