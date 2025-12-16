'use client'

import { Button } from "@/components/ui/common/Button"
import { CardContainer } from "@/components/ui/elements/CardContainer"
import { ConfirmModal } from "@/components/ui/elements/ConfirmModal"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"

export function DeactivateCard() {

    const translation = useTranslations('dashboard.settings.account.deactivation')
    const router = useRouter()


    return <CardContainer
        heading={translation('heading')}
        description={translation('description')}
        rightContent={<div className='flex items-center gap-x-4'>
            <ConfirmModal
                heading={translation('confirmModal.heading')}
                message={translation('confirmModal.message')}
                onConfirm={() => router.push('/account/deactivate')}
            >
                <Button>{translation('button')}</Button>
            </ConfirmModal>
        </div>}
    ></CardContainer>
}