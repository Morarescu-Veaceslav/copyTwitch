'use client'

import { Button } from "@/components/ui/common/Button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/common/Form"
import { Input } from "@/components/ui/common/Input"
import { Separator } from "@/components/ui/common/Separator"
import { Skeleton } from "@/components/ui/common/Skeleton"
import { FormWrapper } from "@/components/ui/elements/FormWrapper"
import { useCreateSocialLinkMutation, useFindSocialLinksQuery, } from "@/graphql/generated/output"
import { socialLinksSchema, type TypeSocialLinksSchema } from "@/schemas/user/social-links.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useTranslations } from "use-intl"
import { SocialLinksList } from "./SocialLinksList"

export function SocialLinksForm() {

    const translation = useTranslations('dashboard.settings.profile.socialLinks.createForm')

    const { loading: isLoadingLinks, refetch } = useFindSocialLinksQuery()

    const form = useForm<TypeSocialLinksSchema>({
        resolver: zodResolver(socialLinksSchema),
        defaultValues: {
            title: '',
            url: ''
        }
    })

    const [create, { loading: isLoadingCreate }] = useCreateSocialLinkMutation({
        onCompleted() {
            form.reset()
            refetch
            toast.success(translation('successMessage'))
        },
        onError() {
            toast.error(translation('errorMessage'))
        }
    })

    const { isValid } = form.formState

    function onSubmit(data: TypeSocialLinksSchema) {
        create({ variables: { data } })
    }

    return isLoadingLinks ? (
        <SocialLinksFormSkeleton />
    ) : (
        <FormWrapper heading={translation('heading')}>
            <Form {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-y-3'>
                    <FormField
                        control={form.control}
                        name='title'
                        render={({ field }) => (
                            <FormItem className='px-5'>
                                <FormLabel>{translation('titleLabel')}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder={translation('titlePlaceholder')}
                                        disabled={isLoadingCreate}
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>{translation('titleDescription')}</FormDescription>
                            </FormItem>
                        )}
                    />
                    <Separator />
                    <FormField
                        control={form.control}
                        name='url'
                        render={({ field }) => (
                            <FormItem className='px-5'>
                                <FormLabel>{translation('urlLabel')}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder={translation('urlPlaceholder')}
                                        disabled={isLoadingCreate}
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>{translation('urlDescription')}</FormDescription>
                            </FormItem>
                        )}
                    />
                    <Separator />
                    <div className='flex justify-end p-5 pb-1'>
                        <Button disabled={!isValid || isLoadingCreate}>{translation("submitButton")}</Button>
                    </div>
                </form>
            </Form>
            <SocialLinksList />
        </FormWrapper>
    )
}


export function SocialLinksFormSkeleton() {
    return <Skeleton className='h-75 w-full' />
}