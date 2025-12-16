import { Separator } from "@/components/ui/common/Separator"
import { useFindNotificationsByUserQuery, useFindNotificationsUnreadCountQuery } from "@/graphql/generated/output"
import { getNotificationIcon } from "@/utils/get-notification-icon"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { Fragment } from "react"
import parse from "html-react-parser"
export function NotificationList() {

    const translate = useTranslations('layout.header.headerMenu.profileMenu.notification')
    const { refetch } = useFindNotificationsUnreadCountQuery()
    const { data, loading: isLoadingNotifications } = useFindNotificationsByUserQuery({
        onCompleted() {
            refetch()
        }
    })

    const notifications = data?.findNotificationsByUser ?? []

    return (
        <>
            <h2 className='text-center text-lg font-medium'>{translate('heading')}</h2>
            <Separator className='my-3' />
            {isLoadingNotifications ? (
                <div className='flex items-center justify-center gap-x-2 text-sm text-foreground'>
                    <Loader2 className='animate-spin size-5' />
                    {translate('loading')}
                </div>
            ) : notifications.length ? (
                notifications.map((notification, indext) => {
                    const Icon = getNotificationIcon(notification.type)
                    return (
                        <Fragment key={indext}>
                            <div className='flex items-center gap-x-3 text-sm'>
                                <div className='rounded-full bg-foreground p-2'>
                                    <Icon className='size-6 text-white' />
                                </div>
                                <div>
                                    {parse(notification.message)}
                                </div>
                            </div>
                            {indext < notifications.length - 1 && (<Separator className="my-3" />)}
                        </Fragment>
                    )
                })
            ) : (
                <div className="text-center text-muted-foreground">{translate('empty')}</div>
            )}
        </>
    )
}