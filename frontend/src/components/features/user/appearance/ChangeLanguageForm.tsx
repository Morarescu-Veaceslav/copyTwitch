'use client'

import { Form, FormField } from "@/components/ui/common/Form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/common/Select"
import { CardContainer } from "@/components/ui/elements/CardContainer"
import { setLanguageAction } from "@/libs/i18n/actions"
import { changeLanguageSchema, TypeChangeLanguageSchema } from "@/schemas/user/change-language.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLocale, useTranslations } from "next-intl"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const languages = {
    ru: "Русский",
    en: "English"
}

export function ChangeLanguageForm() {

    const translation = useTranslations('dashboard.settings.appearance.language')

    const [isPending, startTransition] = useTransition()
    const locale = useLocale()

    const form = useForm<TypeChangeLanguageSchema>({
        resolver: zodResolver(changeLanguageSchema),
        values: {
            language: locale as TypeChangeLanguageSchema['language']
        }
    })


    function onSubmit(data: TypeChangeLanguageSchema) {
        startTransition(() => {
            setLanguageAction(data.language)
                .then(() => toast.success(translation('successMessage')))
        })
    }
    return <CardContainer
        heading={translation('heading')}
        description={translation('description')}
        rightContent={
            <Form {...form}>
                <FormField
                    control={form.control}
                    name='language'
                    render={({ field }) => (
                        <Select
                            onValueChange={value => {
                                field.onChange(value);
                                form.handleSubmit(onSubmit)();
                            }}
                            value={field.value}
                        >
                            <SelectTrigger className='w-[180px]'>
                                <SelectValue placeholder={translation('selectPlaceholder')} />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(languages).map(([code, name]) => (
                                    <SelectItem key={code} value={code} disabled={isPending}>
                                        {name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            </Form>
        }
    />
}