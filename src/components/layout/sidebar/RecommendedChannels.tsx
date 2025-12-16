'use client'

import { Separator } from "@/components/ui/common/Separator"
import { useFindRecommendedChannelsQuery } from "@/graphql/generated/output"
import { useSidebar } from "@/hooks/useSidebar"
import { useTranslations } from "next-intl"
import { ChannelItem, ChannelItemSkeleton } from "./ChannelItem"


export function RecommendedChannels() {
    const translate = useTranslations('layout.sidebar.recommended')
    const { isCollapsed } = useSidebar()
    const { data, loading: isLoadingRecommended } = useFindRecommendedChannelsQuery()
    const channels = data?.findRecommendedChannels ?? []

    return <div>
        <Separator className='mb-3' />
        {!isCollapsed && (
            <h2 className='mb-2 px-3 text-lg font-semibold text-foreground'>
                {translate('heading')}
            </h2>
        )}
        {isLoadingRecommended
            ?
            (
                Array.from({ length: 7 }).map((_, index) => (
                    <ChannelItemSkeleton key={index} />
                ))
            )
            :
            (
                channels.map((channel, index) => (
                    <ChannelItem key={index} channel={channel} />
                ))
            )}
    </div>
}