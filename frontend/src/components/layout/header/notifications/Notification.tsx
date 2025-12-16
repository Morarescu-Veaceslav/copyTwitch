'use client'

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/common/Popover"
import { useFindNotificationsUnreadCountQuery } from "@/graphql/generated/output"
import { Bell } from "lucide-react"
import { NotificationList } from "./NotificationList"




export function Notifications() {

    const { data, loading: isLoadingCount } = useFindNotificationsUnreadCountQuery()

    const count = data?.findNotificationsUnreadCount ?? 0

    const displayCount = count > 10 ? '+9' : count

    if (isLoadingCount) return null

    return (
        <Popover>
            <PopoverTrigger>
                {true && <div className='absolute right-[72px] top-5 rounded-full bg-primary px-[5px]
                text-xs font-semibold text-white'>
                    {displayCount}</div>}
                <Bell className='size-5 text-foreground' />
            </PopoverTrigger>
            <PopoverContent align='end' className='max-h-[320px] overflow-y-auto'>
                <NotificationList />
            </PopoverContent>
        </Popover>
    )
}