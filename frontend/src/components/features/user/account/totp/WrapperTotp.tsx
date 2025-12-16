'use client'

import { Skeleton } from "@/components/ui/common/Skeleton"
import { CardContainer } from "@/components/ui/elements/CardContainer"
import { useCurrent } from "@/hooks/useCurrent"
import { useTranslations } from "next-intl"
import { EnableTotp } from "./EnableTotp"
import { DisableTotp } from "./Disable"

export function WrapperTotp() {

    const translation = useTranslations('dashboard.settings.account.twoFactor')

    const { user, isLoadingProfile } = useCurrent()

    return isLoadingProfile ? (
        <WrapperTotpSkeleton />
    ) : (
        <CardContainer
            heading={translation('heading')}
            description={translation('description')}
            rightContent={<div className='flex items-center gap-x-4'>
                {!user?.isTotpEnabled ? <EnableTotp /> : <DisableTotp />}
            </div>}
        />
    )
}

export function WrapperTotpSkeleton() {
    return <Skeleton className='h-24 w-full' />
}