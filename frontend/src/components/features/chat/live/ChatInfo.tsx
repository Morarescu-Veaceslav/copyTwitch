import { useAuth } from "@/hooks/useAuth"
import { Info } from "lucide-react"
import { useTranslations } from "next-intl"

interface ChatInfoProps {
    isOwnerChannel: boolean
    isFollower: boolean
    isSponsor: boolean
    isChatEnabled: boolean
    isChatFollowersOnly: boolean
    isChatPremiumFollowersOnly: boolean
}

export function ChatInfo({
    isOwnerChannel,
    isFollower,
    isSponsor,
    isChatEnabled,
    isChatFollowersOnly,
    isChatPremiumFollowersOnly
}: ChatInfoProps) {

    const translation = useTranslations('stream.chat.info')
    const { isAuthenticated } = useAuth()

    let message = ''

    if (!isAuthenticated) {
        message = translation('authRequired')
    } else if (isOwnerChannel) {
        return null
    } else if (!isChatEnabled) {
        message = translation('chatDisabled')
    } else if (isChatPremiumFollowersOnly && !isSponsor) {
        message = translation('premiumFollowersOnly')
    } else if (isChatFollowersOnly && !isFollower) {
        message = translation('followersOnly')
    } else {
        return null
    }

    return (
        <div className='mt-2 flex h-10 w-full items-center gap-x-2 
        rounded-md border bg-accent px-3 text-muted-foreground'>
            <Info className='size-4' />
            <p className='text-sm font-semibold'>{message}</p>
        </div>
    )
}