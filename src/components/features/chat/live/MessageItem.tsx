import type { FindChatMessagesByStreamQuery } from "@/graphql/generated/output";
import { stringToColor } from "@/utils/color";
import { Medal } from "lucide-react";

interface MessageItemProps {
    message: FindChatMessagesByStreamQuery['findChatMessagesByStream'][number]
    isSponsor: boolean
}

export function MessageItem({ message, isSponsor }: MessageItemProps) {

    const color = stringToColor(message.user.username ?? '')
    const formattedTime = new Date(message.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    })

    return <div className='flex gap-2 p-2 rounded-md hover:bg-accent'>
        <p className='text-sm text-muted-foreground'>{formattedTime}</p>
        <div className='flex grow flex-wrap items-baseline gap-1'>
            <p className='flex items-center whitespace-nowrap text-sm font-semibold'>
                <span className='truncate' style={{ color }}>
                    {message.user.username}
                </span>
                {isSponsor && (
                    <Medal className='ml-1 size-3.5' style={{ color }} />
                )}
            </p>
            <p className='break-all text-sm'>{message.text}</p>
        </div>
    </div>
}

