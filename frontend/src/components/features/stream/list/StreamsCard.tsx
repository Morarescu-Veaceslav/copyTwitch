import type { FindRandomStreamsQuery } from "@/graphql/generated/output";
import Link from "next/link";
import { StreamThumbnail } from "./StreamThumbnail";
import { ChannelAvatar } from "@/components/ui/elements/ChannelAvatar";
import { ChannelVerified } from "@/components/ui/elements/ChannelVerified";
import { Skeleton } from "@/components/ui/common/Skeleton";


interface StreamsCardProps {
    stream: FindRandomStreamsQuery['findRandomStreams'][number]
}

export function StreamCard({ stream }: StreamsCardProps) {

    return <div className='h-full w-full'>
        <Link href={`/${stream.user.username}`}>
            <StreamThumbnail url={stream.thumbnailUrl} user={stream.user} isLive={stream.isLive} />
            <h2 className='mt-3 truncate text-base font-semibold 
            text-foreground hover:text-primary'>{stream.title}</h2>
        </Link>
        <div className='mt-3 flex gap-x-3'>
            <ChannelAvatar channel={stream.user} isLive={stream.isLive} />
            <div className='flex flex-col overflow-hidden text-sm'>
                <h2 className='flex items-center gap-x-2 font-semibold text-foreground'>
                    {stream.user.username}
                    {stream.user.isVerified && <ChannelVerified size='sm' />}
                </h2>
                {stream.category && (<Link href={`/categories/${stream.category.slug}`} className='text-muted-foreground'>
                    {stream.category.title}
                </Link>)}
            </div>
        </div>
    </div>
}


export function StreamCardSkeleton() {
    return (
        <div className='w-full'>
            <Skeleton className='relative aspect-video rounded-xl' />
            <Skeleton className='mt-3 h-4 w-full' />
            <div className='mt-3 flex gap-x-4'>
                <Skeleton className='size-10 rounded-full' />
                <div className='ml-2 flex flex-col gap-y-2'>
                    <Skeleton className='h-3 w-20' />
                    <Skeleton className='h-3 w-20' />
                </div>
            </div>
        </div>

    )
}