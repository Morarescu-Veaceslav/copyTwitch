import { Skeleton } from "@/components/ui/common/Skeleton";
import { useFindMyFollowingsQuery, useFindSponsorsByChannelQuery, type FindChannelByUsernameQuery } from "@/graphql/generated/output";
import { ConnectionState } from "livekit-client";
import { useTranslations } from "next-intl";
import { useConnectionState, useRemoteParticipant } from "@livekit/components-react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/common/Card";
import { MessageSquareOff } from "lucide-react";
import { LoadingChat } from "./LoadingChat";
import { SendMessageForm } from "./SendMessageForm";
import { MessageList } from "./MessageList";
import { ChatInfo } from "./ChatInfo";
import { useCurrent } from "@/hooks/useCurrent";


interface LiveChatProps {
    channel: FindChannelByUsernameQuery['findChannelByUsername']
    isChatEnabled: boolean
    isChatFollowersOnly: boolean
    isChatPremiumFollowersOnly: boolean
}


export function LiveChat({
    channel,
    isChatEnabled,
    isChatFollowersOnly,
    isChatPremiumFollowersOnly
}: LiveChatProps) {

    const translation = useTranslations('stream.chat')

    const { isAuthenticated } = useAuth()
    const { user, isLoadingProfile } = useCurrent()
    const connectionState = useConnectionState()
    const participant = useRemoteParticipant(channel.id)

    const { data: followingsData, loading: isLoadingFollowings } = useFindMyFollowingsQuery({
        skip: !isAuthenticated
    })

    const { data: sponsorsData, loading: isLoadingSponsors } = useFindSponsorsByChannelQuery({
        variables: {
            channelId: channel.id
        }
    })

    const followings = followingsData?.findMyFollowings ?? []
    const sponsors = sponsorsData?.findSponsorsByChannel ?? []

    const isOwnerChannel = user?.id === channel.id
    const isFollower = followings.some(following => following.followingId === channel.id)
    const isSponsor = sponsors.some(sponsors => sponsors.user.id === user?.id)

    const isOnline = participant && connectionState === ConnectionState.Connected

    const isDisabled = !isOnline || !isAuthenticated || !isChatEnabled ||
        (isChatFollowersOnly &&
            !isFollower && !isOwnerChannel) || (isChatPremiumFollowersOnly && !isSponsor &&
                !isOwnerChannel)

    if (connectionState === ConnectionState.Connecting || isLoadingProfile ||
        isLoadingFollowings || isLoadingSponsors
    ) {
        return <LoadingChat />
    }


    return <Card className='flex overflow-y-auto lg:fixed  h-[82%] w-[21.5%] flex-col xl:mt-0'>
        <CardHeader className='border-b py-2'>
            <CardTitle className='text-center text-lg'>
                {translation('heading')}
            </CardTitle>
        </CardHeader>
        <CardContent className='flex h-full flex-col overflow-y-auto p-4'>
            {isOnline ? (
                <>
                    <MessageList channel={channel} />
                    <ChatInfo
                        isOwnerChannel={isOwnerChannel}
                        isFollower={isFollower}
                        isSponsor={isSponsor}
                        isChatEnabled={isChatEnabled}
                        isChatFollowersOnly={isChatFollowersOnly}
                        isChatPremiumFollowersOnly={isChatPremiumFollowersOnly}
                    />
                    <SendMessageForm channel={channel} isDisabled={isDisabled} />
                </>
            ) : (
                <div className='flex h-full flex-col items-center justify-center'>
                    <MessageSquareOff className='size-10 text-muted-foreground' />
                    <h2 className='mt-3 text-xl font-medium'>{translation('unavailable')}</h2>
                    <p className='mt-1 w-full text-center text-muted-foreground'>{translation('unavailableMessage')}</p>
                </div>
            )}
        </CardContent>
    </Card>
}







export function LiveChatSkeleton() {
    return (
        <Skeleton className='fixed my-8 flex h-[82%] w-[21.5%] flex-col xl:mt-0' />
    )
}