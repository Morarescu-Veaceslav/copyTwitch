import { useTranslations } from "next-intl"
import type { Route } from "./route.interface"
import { Folder, Home, Radio } from "lucide-react"
import { SideBarItem } from "./SideBarItem"
import { RecommendedChannels } from "./RecommendedChannels"

export function UserNav() {

    const translate = useTranslations('layout.sidebar.userNav')
    const routers: Route[] = [
        {
            label: translate('home'),
            href: '/',
            icon: Home
        },
        {
            label: translate('categories'),
            href: '/categories',
            icon: Folder
        },
        {
            label: translate('streams'),
            href: '/streams',
            icon: Radio
        }
    ]
    return <div className='space-y-2 px-2 pt-4 lg:pt-0'>
        {routers.map((route, index) => (
            <SideBarItem key={index} route={route} />
        ))}
        <RecommendedChannels />
    </div>
}