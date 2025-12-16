import { Button } from "@/components/ui/common/Button";
import { ConfirmModal } from "@/components/ui/elements/ConfirmModal";
import { useFindMyFollowersQuery, useFindMyFollowingsQuery, useFollowChannelMutation, useUnfollowChanelMutation, type FindChannelByUsernameQuery } from "@/graphql/generated/output";
import { useAuth } from "@/hooks/useAuth";
import { useCurrent } from "@/hooks/useCurrent";
import { parseApolloMessage } from "@/utils/gqlError";
import { Heart, HeartOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


interface FollowButtonProps {
    channel: FindChannelByUsernameQuery['findChannelByUsername']
}

export function FollowButton({ channel }: FollowButtonProps) {

    const translation = useTranslations('stream.actions.follow')

    const router = useRouter()

    const { isAuthenticated } = useAuth()
    const { user, isLoadingProfile } = useCurrent()

    const { data, loading: isLoadingFollowings, refetch } = useFindMyFollowingsQuery({
        skip: !isAuthenticated
    })


    const [follow, { loading: isLoadingFollow }] = useFollowChannelMutation({
        onCompleted() {
            refetch()
            toast.success(translation('successFollowMessage'))
        },
        onError(error) {
            toast.error(translation(`${parseApolloMessage(error).code}`))
        }
    })

    const [unfollow, { loading: isLoadingUnfollow }] = useUnfollowChanelMutation({
        onCompleted() {
            refetch()
            toast.success(translation('successUnfollowMessage'))
        },
        onError(error) {
            toast.error(translation(`${parseApolloMessage(error).code}`))
        }
    })



    const followings = data?.findMyFollowings
    const isOwnerChannel = user?.id === channel.id
    const isExistingFollow = followings?.some(
        following => following.followingId === channel.id
    )

    if (isOwnerChannel || isLoadingProfile) {
        return null
    }

    return isExistingFollow ? (
        <ConfirmModal heading={translation('confirmUnfollowHeading')}
            message={translation('confirmUnfollowMessage')} onConfirm={() => unfollow({ variables: { chanelId: channel.id } })}>
            <Button disabled={isLoadingFollowings || isLoadingUnfollow}>
                <HeartOff className='size-4' />
                {translation('unfollowButton')}
            </Button>
        </ConfirmModal>
    ) : (
        <Button onClick={() => isAuthenticated ? follow({ variables: { channelId: channel.id } }) : router.push('/account/login')}
            disabled={isLoadingFollowings || isLoadingFollow}>
            <Heart className='size-4' />
            {translation('followButton')}
        </Button>
    )
}