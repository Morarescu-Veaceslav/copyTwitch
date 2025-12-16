'use client'

import { useNewPasswordMutation } from "@/graphql/generated/output"
import { newPasswordSchema, type TypeNewPasswordSchema } from "@/schemas/auth/new-password.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { AuthWrapper } from "../AuthWrapper"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/common/Form"
import { Input } from "@/components/ui/common/Input"
import { Button } from "@/components/ui/common/Button"
import { parseApolloMessage } from "@/utils/gqlError"


export function NewPasswordForm() {

    const translate = useTranslations('auth.newPassword')
    const router = useRouter()
    const params = useParams<{ token: string }>()

    const form = useForm<TypeNewPasswordSchema>({
        resolver: zodResolver(newPasswordSchema),
        defaultValues: {
            password: '',
            passwordRepeat: ''
        }
    })

    const [newPassword, { loading: isLoadingNew }] = useNewPasswordMutation({
        onCompleted() {
            toast.success(translate('successMessage'))
            router.push('/account/login')
        },
        onError(error) {
            toast.error(translate(`${parseApolloMessage(error).code}`))
        }
    })

    const { isValid } = form.formState

    function onSubmit(data: TypeNewPasswordSchema) {
        newPassword({ variables: { data: { ...data, token: params.token } } })
    }


    return (
        <AuthWrapper
            heading={translate('heading')}
            backButtonLabel={translate('backButtonLabel')}
            backButtonHref="/account/login"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-3">
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{translate('passwordLabel')}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="********"
                                        disabled={isLoadingNew}
                                        type="password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>{translate('passwordDescription')}</FormDescription>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="passwordRepeat"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{translate('passwordRepeatLabel')}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="********"
                                        disabled={isLoadingNew}
                                        type="password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>{translate('passwordRepeatDescription')}</FormDescription>
                            </FormItem>
                        )}
                    />

                    <Button className="mt-2 w-full" disabled={!isValid || isLoadingNew}>{translate('submitButton')}</Button>
                </form>
            </Form>

        </AuthWrapper>
    )
}