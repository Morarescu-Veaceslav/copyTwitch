'use client'

import { useResetPasswordMutation } from "@/graphql/generated/output"
import { resetPasswordSchema, type TypeResetPasswordSchema } from "@/schemas/auth/reset-password.schema"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useTranslations } from "use-intl"
import { AuthWrapper } from "../AuthWrapper"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/common/Alert"
import { CircleCheck } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/common/Form"
import { Input } from "@/components/ui/common/Input"
import { Button } from "@/components/ui/common/Button"
import { parseApolloMessage } from "@/utils/gqlError"

export function ResetPasswordForm() {

    const translate = useTranslations('auth.resetPassword')
    const [isSuccess, setIsSuccess] = useState(false)

    const form = useForm<TypeResetPasswordSchema>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            'email': ''
        }
    })

    const [resetPassword, { loading: isLoadingReset }] = useResetPasswordMutation({
        onCompleted() {
            setIsSuccess(true)
        },
        onError(error) {
            toast.error(translate(`${parseApolloMessage(error).code}`))
        }
    })

    const { isValid } = form.formState

    function onSubmit(data: TypeResetPasswordSchema) {
        resetPassword({ variables: { data } })
    }


    return (
        <AuthWrapper
            heading={translate('heading')}
            backButtonLabel={translate('backButtonLabel')}
            backButtonHref="/account/login"
        >

            {isSuccess ? (
                <Alert>
                    <CircleCheck className='size-4' />
                    <AlertTitle>{translate('successAlertTite')}</AlertTitle>
                    <AlertDescription>{translate('successAlertDescription')}</AlertDescription>
                </Alert>
            ) : (

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-y-3'>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{translate('emailLabel')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="arsen@example.com"
                                            disabled={isLoadingReset}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>{translate('emailDescription')}</FormDescription>
                                </FormItem>
                            )}
                        />

                        <Button className='mt-2 w-full' disabled={!isValid || isLoadingReset}>{translate('submitButton')}</Button>
                    </form>
                </Form>
            )}


        </AuthWrapper>
    )
}