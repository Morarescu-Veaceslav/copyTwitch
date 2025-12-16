'use client'

import { Button } from "@/components/ui/common/Button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/common/Form"
import { Input } from "@/components/ui/common/Input"
import { Separator } from "@/components/ui/common/Separator"
import { Skeleton } from "@/components/ui/common/Skeleton"
import { Textarea } from "@/components/ui/common/Textarea"
import { FormWrapper } from "@/components/ui/elements/FormWrapper"
import { useChangeProfileInfoMutation } from "@/graphql/generated/output"
import { useCurrent } from "@/hooks/useCurrent"
import { changeInfoSchema, type TypeChangeInfoSchema } from "@/schemas/user/change-info.schema"
import { parseApolloMessage } from "@/utils/gqlError"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useTranslations } from "use-intl"


export function ChangeInfoForm() {
    const translation = useTranslations('dashboard.settings.profile.info')

    const { user, isLoadingProfile, refetch } = useCurrent()

    const form = useForm<TypeChangeInfoSchema>({
        resolver: zodResolver(changeInfoSchema),
        values: {
            username: user?.username ?? '',
            displayName: user?.displayName ?? '',
            bio: user?.bio ?? ''
        }
    })

    const [update, { loading: isLoadingUpdate }] = useChangeProfileInfoMutation({
        onCompleted() {
            refetch()
            toast(translation('successMessage'))
        },
        onError(error) {
            toast.error(translation(`${parseApolloMessage(error).code}`))
        }
    })



    const { isValid, isDirty } = form.formState

    function onSubmit(data: TypeChangeInfoSchema) {
        update({ variables: { data } })
    }


    return isLoadingProfile ? (
        <ChangeInfoFormSkeleton />
    ) : (
        <FormWrapper heading={translation('heading')}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name='username'
                        render={({ field }) => (
                            <FormItem className="px-5 pb-3">
                                <FormLabel>{translation('userNameLabel')}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder={translation('usernamePlaceholder')}
                                        disabled={isLoadingUpdate}
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    {translation('usernameDescription')}
                                </FormDescription>
                            </FormItem>
                        )}
                    />
                    <Separator />
                    <FormField
                        control={form.control}
                        name='displayName'
                        render={({ field }) => (
                            <FormItem className="p-5 pb-3">
                                <FormLabel>{translation('displayNameLabel')}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder={translation('displayNamePlaceholder')}
                                        disabled={isLoadingUpdate}
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    {translation('displayNameDescription')}
                                </FormDescription>
                            </FormItem>
                        )}
                    />
                    <Separator />
                    <FormField
                        control={form.control}
                        name='bio'
                        render={({ field }) => (
                            <FormItem className="p-5 pb-3">
                                <FormLabel>{translation('bioLabel')}</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder={translation('bioPlaceholder')}
                                        disabled={isLoadingUpdate}
                                        {...field}

                                    />
                                </FormControl>
                                <FormDescription>
                                    {translation('bioDescription')}
                                </FormDescription>
                            </FormItem>
                        )}
                    />
                    <Separator />
                    <div className='flex justify-end p-5 pb-1'>
                        <Button disabled={!isValid || !isDirty || isLoadingUpdate}>{translation("submitButton")}</Button>
                    </div>
                </form>
            </Form>
        </FormWrapper>
    )
}


export function ChangeInfoFormSkeleton() {
    return <Skeleton className="h-96 w-full" />
}