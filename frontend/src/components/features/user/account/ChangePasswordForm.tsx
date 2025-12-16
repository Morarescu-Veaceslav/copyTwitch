'use client'

import { Button } from "@/components/ui/common/Button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/common/Form"
import { Input } from "@/components/ui/common/Input"
import { Separator } from "@/components/ui/common/Separator"
import { Skeleton } from "@/components/ui/common/Skeleton"
import { FormWrapper } from "@/components/ui/elements/FormWrapper"
import { useChangePasswordMutation } from "@/graphql/generated/output"
import { useCurrent } from "@/hooks/useCurrent"
import { changePasswordSchema, type TypeChangePasswordSchema } from "@/schemas/user/change-password.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function ChangePasswordForm() {

    const translation = useTranslations('dashboard.settings.account.password')

    const { isLoadingProfile, refetch } = useCurrent()

    const form = useForm<TypeChangePasswordSchema>({
        resolver: zodResolver(changePasswordSchema),
        values: {
            oldPassword: '',
            newPassword: ''
        }
    })

    const [update, { loading: isLoadingUpdate }] = useChangePasswordMutation({
        onCompleted() {
            form.reset()
            refetch()
            toast.success(translation('successMessage'))
        },
        onError() {
            toast.error(translation('errorMessage'))
        }
    })

    const { isValid } = form.formState

    function onSubmit(data: TypeChangePasswordSchema) {
        update({ variables: { data } })
    }

    return isLoadingProfile ? (
        <ChangePasswordSkeleton />
    ) : (
        <FormWrapper heading={translation('heading')}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-y-3'>
                    <FormField
                        control={form.control}
                        name='oldPassword'
                        render={({ field }) => (
                            <FormItem className="px-5">
                                <FormLabel>{translation('oldPasswordLabel')}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder={translation('oldPasswordPlaceholder')}
                                        disabled={isLoadingUpdate}
                                        type='password'
                                        {...field}

                                    />
                                </FormControl>
                                <FormDescription>{translation('newPasswordDescription')}</FormDescription>
                            </FormItem>
                        )}
                    />
                    <Separator />
                    <FormField
                        control={form.control}
                        name='newPassword'
                        render={({ field }) => (
                            <FormItem className='px-5'>
                                <FormLabel>{translation('newPasswordLabel')}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder={translation('newPasswordPlaceholder')}
                                        disabled={isLoadingUpdate}
                                        type='password'
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>{translation('newPasswordDescription')}</FormDescription>
                            </FormItem>
                        )}
                    />
                    <Separator />
                    <div className='flex justify-end p-5 pb-1'>
                        <Button disabled={!isValid || isLoadingUpdate}>{translation('submitButton')}</Button>
                    </div>
                </form>
            </Form>
        </FormWrapper>
    )
}


export function ChangePasswordSkeleton() {
    return <Skeleton className='h-96 w-full' />
}