'use client'

import { Button } from "@/components/ui/common/Button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/common/Form"
import { Input } from "@/components/ui/common/Input"
import { Separator } from "@/components/ui/common/Separator"
import { Skeleton } from "@/components/ui/common/Skeleton"
import { FormWrapper } from "@/components/ui/elements/FormWrapper"
import { useChangeEmailMutation } from "@/graphql/generated/output"
import { useCurrent } from "@/hooks/useCurrent"
import { changeEmailSchema, type TypeChangeEmailSchema } from "@/schemas/user/change-email.schema"
import { parseApolloMessage } from "@/utils/gqlError"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useTranslations } from "use-intl"


export function ChangeEmailForm() {

    const translation = useTranslations('dashboard.settings.account.email')

    const { user, isLoadingProfile, refetch } = useCurrent()

    const form = useForm<TypeChangeEmailSchema>({
        resolver: zodResolver(changeEmailSchema),
        values: {
            email: user?.email ?? ''
        }
    })

    const [update, { loading: isLoadingUpdate }] = useChangeEmailMutation({
        onCompleted() {
            refetch()
            toast.success(translation('successMessage'))
        },
        onError(error) {
            toast.error(translation(`${parseApolloMessage(error).code}`))
        }
    })

    const { isValid, isDirty } = form.formState

    function onSubmit(data: TypeChangeEmailSchema) {
        update({ variables: { data } })
    }



    return isLoadingProfile ? (
        <ChangeEmailFormSkeleton />
    ) : (
        <FormWrapper heading={translation('heading')}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-y-3'>
                    <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem className="px-5">
                                <FormLabel>{translation('emailLabel')}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='email@example.com'
                                        disabled={isLoadingUpdate}
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>{translation('emailDescription')}</FormDescription>
                            </FormItem>
                        )}
                    />
                    <Separator />
                    <div className='flex justify-end p-5 pb-1'>
                        <Button disabled={!isValid || !isDirty || isLoadingUpdate}>{translation('submitButton')}</Button>
                    </div>
                </form>
            </Form>

        </FormWrapper>
    )
}


export function ChangeEmailFormSkeleton() {
    return <Skeleton className='h-64 w-full' />
}