'use client'
import { Heading } from "@/components/ui/elements/Heading"
import { useCurrent } from "@/hooks/useCurrent"
import { useTranslations } from "next-intl"
import { InstructionModal } from "./InstructionModal"
import { CreateIngressForm } from "./forms/CreateIngressForm"
import { ToggleCardSkeleton } from "@/components/ui/elements/ToggleCard"
import { StreamURL } from "./forms/StreamURL"
import { StreamKey } from "./forms/StreamKey"

export function KeysSettings() {

    const translate = useTranslations('dashboard.keys.header')

    const { user, isLoadingProfile } = useCurrent()

    return (

        <div className="w-full px-4 lg:px-10 max-w-screen-xl mx-auto">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 lg:gap-0">

                <div className="flex-1">
                    <Heading
                        title={translate('heading')}
                        description={translate('description')}
                        size="lg"
                    />
                </div>
                <div className="flex items-center mt-3 lg:mt-0 gap-x-4">
                    <InstructionModal />
                    <CreateIngressForm />
                </div>

            </div>
            <div className='mt-5 space-y-6'>
                {isLoadingProfile ? Array.from({ length: 2 }).map((_, index) => (
                    <ToggleCardSkeleton key={index} />
                )) : (
                    <>
                        <StreamURL value={user?.stream.serverUrl} />
                        <StreamKey value={user?.stream.streamKey} />
                    </>
                )}
            </div>
        </div>



    )
}