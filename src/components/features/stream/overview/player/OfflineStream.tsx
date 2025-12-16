'use client'

import { Card } from "@/components/ui/common/Card";
import type { FindChannelByUsernameQuery } from "@/graphql/generated/output";
import { getMediaSource } from "@/utils/get-media-source";
import { WifiOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { CSSProperties } from "react";

interface OfflineStreamProps {
    channel: FindChannelByUsernameQuery['findChannelByUsername']
}

export function OfflineStream({ channel }: OfflineStreamProps) {

    const translation = useTranslations('stream.video')
    const hasThumbnail = Boolean(channel.stream.thumbnailUrl);


    const backgroundStyle: CSSProperties = hasThumbnail ? {
        backgroundImage: `url(${getMediaSource(channel.stream.thumbnailUrl)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    } : {}


    return <Card className='flex h-full flex-col items-center justify-center' style={backgroundStyle}>

        <div className={`absolute inset-0 z-0 rounded-lg ${hasThumbnail
            ? 'bg-black/50'
            : 'bg-black/40 backdrop-blur-md'
            }`}>
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/20 to-transparent blur-xl" />
        </div>

        <WifiOff className='z-10 size-12 text-muted' />
        <p className='z-10 text-lg text-white mt-3'>{channel.displayName} {translation('offline')}</p>
    </Card>
}