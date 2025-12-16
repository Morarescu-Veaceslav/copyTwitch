import { FindProfileQuery } from "@/graphql/generated/output";
import { cva, type VariantProps } from "class-variance-authority";
import { Avatar, AvatarFallback, AvatarImage } from "../common/Avatar";
import { cn } from "@/utils/tw-merge";
import { getMediaSource } from "@/utils/get-media-source";
import { Skeleton } from "../common/Skeleton";



const avatarSizes = cva('', {
    variants: {
        size: {
            sm: 'size-7',
            default: 'size-9',
            lg: 'size-14',
            xl: 'size-32'
        }
    },
    defaultVariants: {
        size: 'default'
    }
})

interface ChannelAvatarProps extends VariantProps<typeof avatarSizes> {
    channel: Pick<FindProfileQuery['findProfile'], 'username' | 'avatar'>
    isLive?: boolean
}

export function ChannelAvatar({ size, channel, isLive }: ChannelAvatarProps) {

    return (
        <div className='relative'>
            <Avatar className={cn(avatarSizes({ size }), isLive && 'ring-2 ring-rose-500')}>
                <AvatarImage src={getMediaSource(channel.avatar)} />
                <AvatarFallback className={cn(size === 'xl' && 'text-4xl', size === 'lg' && 'text-2xl')}>{channel.username?.[0] ?? ChangeAvatarFormSkeleton()}</AvatarFallback>
            </Avatar>
        </div>
    )
}

function ChangeAvatarFormSkeleton() {
    return (
        <Skeleton className='h-52 w-full' />
    )
}