'use client'

import { Form, FormField } from "@/components/ui/common/Form"
import { ToggleCard, ToggleCardSkeleton } from "@/components/ui/elements/ToggleCard"
import { useChangeNotificationsSettingsMutation } from "@/graphql/generated/output"
import { useCurrent } from "@/hooks/useCurrent"
import { changeNotificationsSettingsSchema, type TypeChangeNotificationsSettingsSchema } from "@/schemas/user/change-notifications.settings.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function ChangeNotificationsSettingsForm() {

    const translation = useTranslations('dashboard.settings.notifications')

    const { user, isLoadingProfile, refetch } = useCurrent()

    const form = useForm<TypeChangeNotificationsSettingsSchema>({
        resolver: zodResolver(changeNotificationsSettingsSchema),
        values: {
            siteNotifications: user?.notificationSettings?.siteNotifications ?? false,
            telegramNotifications: user?.notificationSettings?.telegramNotifications ?? false
        }
    })



    const [update, { loading: isLoadingUpdate }] = useChangeNotificationsSettingsMutation({
        onCompleted(data) {
            refetch()
            toast(translation('successMessage'))
            if (data.changeNotificationsSettings.telegramAuthToken) {
                window.open(`https://t.me/morarescu_bot?start=${data.changeNotificationsSettings.telegramAuthToken}`, '_blank')
            }
        },
        onError() {
            toast(translation('errorMessage'))
        }
    })

    function onChange(field: keyof TypeChangeNotificationsSettingsSchema, value: boolean) {
        form.setValue(field, value)
        update({
            variables: {
                data: { ...form.getValues(), [field]: value }
            }
        })
    }

    return isLoadingProfile ? (
        Array.from({ length: 2 }).map((_, index) => (
            <ToggleCardSkeleton key={index} />
        ))
    ) : (
        <Form {...form}>
            <FormField
                control={form.control}
                name='siteNotifications'
                render={({ field }) => (
                    <ToggleCard
                        heading={translation('siteNotifications.heading')}
                        description={translation('siteNotifications.description')}
                        isDisabled={isLoadingUpdate}
                        value={field.value}
                        onChange={value => onChange('siteNotifications', value)}
                    />
                )}
            />

            <FormField
                control={form.control}
                name='telegramNotifications'
                render={({ field }) => (
                    <ToggleCard
                        heading={translation('telegramNotifications.heading')}
                        description={translation('telegramNotifications.description')}
                        isDisabled={isLoadingUpdate}
                        value={field.value}
                        onChange={value => onChange('telegramNotifications', value)}
                    />
                )}
            />
        </Form>
    )
}