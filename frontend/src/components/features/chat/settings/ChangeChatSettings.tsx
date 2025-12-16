'use client'

import { Form, FormField } from "@/components/ui/common/Form"
import { Heading } from "@/components/ui/elements/Heading"
import { ToggleCard, ToggleCardSkeleton } from "@/components/ui/elements/ToggleCard"
import { useChangeChatSettingsMutation } from "@/graphql/generated/output"
import { useCurrent } from "@/hooks/useCurrent"
import { changeChatSettingsSchema, type TypeChangeChatSettingsSchema } from "@/schemas/chat/change-chat.settings.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function ChangeChatSettings() {

    const translate = useTranslations('dashboard.chat')

    const { user, isLoadingProfile } = useCurrent()

    const form = useForm<TypeChangeChatSettingsSchema>({
        resolver: zodResolver(changeChatSettingsSchema),
        values: {
            isChatEnabled: user?.stream.isChatEnabled ?? false,
            isChatFollowersOnly: user?.stream.isChatFollowersOnly ?? false,
            isChatPremiumFollowersOnly: user?.stream.isChatPremiumFollowersOnly ?? false
        }
    })


    const [update, { loading: isLoadingUpdate }] = useChangeChatSettingsMutation({
        onCompleted() {
            toast.success(translate('successMessage'))
        },
        onError() {
            toast.error(translate('errorMessage'))
        }
    })

    function onChange(
        field: keyof TypeChangeChatSettingsSchema,
        value: boolean
    ) {
        form.setValue(field, value)

        update({
            variables: {
                data: { ...form.getValues(), [field]: value }
            }
        })
    }


    return <div className='lg:px-10 w-full'>
        <Heading title={translate('header.heading')} description={translate('header.description')} size='lg' />
        <div className='mt-3 space-y-6'>
            {isLoadingProfile ? (
                Array.from({ length: 3 }).map((_, index) => (
                    <ToggleCardSkeleton key={index} />
                ))
            ) : (
                <Form {...form}>
                    <FormField
                        control={form.control}
                        name='isChatEnabled'
                        render={({ field }) => (
                            <ToggleCard
                                heading={translate('isChatEnabled.heading')}
                                description={translate('isChatEnabled.description')}
                                isDisabled={isLoadingUpdate}
                                value={field.value}
                                onChange={value => onChange('isChatEnabled', value)}
                            />
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='isChatFollowersOnly'
                        render={({ field }) => (
                            <ToggleCard
                                heading={translate('isChatFollowersOnly.heading')}
                                description={translate('isChatFollowersOnly.description')}
                                isDisabled={isLoadingUpdate}
                                value={field.value}
                                onChange={value => onChange('isChatFollowersOnly', value)}
                            />
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='isChatPremiumFollowersOnly'
                        render={({ field }) => (
                            <ToggleCard
                                heading={translate('isChatPremiumFollowersOnly.heading')}
                                description={translate('isChatPremiumFollowersOnly.description')}
                                isDisabled={isLoadingUpdate || !user?.isVerified}
                                value={field.value}
                                onChange={value => onChange('isChatPremiumFollowersOnly', value)}
                            />
                        )}
                    />

                </Form>
            )}
        </div>
    </div>
}