import { useTranslations } from "next-intl"
import type { Route } from "./route.interface"
import { Banknote, DollarSign, KeyRound, Medal, MessageSquare, Settings, Users } from "lucide-react"
import { SideBarItem } from "./SideBarItem"

export function DashboardNav() {
    const translate = useTranslations('layout.sidebar.dashboardNav')
    const routers: Route[] = [
        {
            label: translate('settings'),
            href: '/dashboard/settings',
            icon: Settings
        },
        {
            label: translate('keys'),
            href: '/dashboard/keys',
            icon: KeyRound
        },
        {
            label: translate('chatSettings'),
            href: '/dashboard/chat',
            icon: MessageSquare
        },
        {
            label: translate('followers'),
            href: '/dashboard/followers',
            icon: Users
        },
        {
            label: translate('sponsors'),
            href: '/dashboard/sponsors',
            icon: Medal
        },
        {
            label: translate('premium'),
            href: '/dashboard/plans',
            icon: DollarSign
        },
        {
            label: translate('transactions'),
            href: '/dashboard/transactions',
            icon: Banknote
        }
    ]


    return <div className='space-y-2 px-2 pt-4 lg:pt-0'>
        {routers.map((route, index) => (
            <SideBarItem key={index} route={route} />
        ))}
    </div>
}