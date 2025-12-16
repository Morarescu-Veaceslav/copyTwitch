'use client'

import { Button } from "@/components/ui/common/Button";
import { Hint } from "@/components/ui/elements/Hint";
import { useSidebar } from "@/hooks/useSidebar";
import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export function SideBarHeader() {
    const translation = useTranslations('layout.sidebar.header')
    const pathname = usePathname()

    const { isCollapsed, open, close } = useSidebar()

    const label = isCollapsed ? translation('expand') : translation('collapse')

    return (
        isCollapsed ? (<div className='mb-4 hidden w-full items-center justify-center pt-4 lg:flex'>
            <Hint label={label} side="right" asChild>
                <Button onClick={() => open()} variant="ghost" size="icon">
                    <ArrowRightFromLine className="size-4" />
                </Button>
            </Hint>
        </div>) : (<div className="mb-2 flex w-full items-center justify-between p-3 pl-4">
            <h2 className='text-lg font-semibold text-foreground'>{translation('navigation')}</h2>
            <Hint label={label} side="right" asChild>
                <Button onClick={() => close()} variant="ghost" size="icon">
                    <ArrowLeftFromLine className="size-4" />
                </Button>
            </Hint>
        </div>)
    )
}