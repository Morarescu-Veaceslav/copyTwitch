'use client'

import { useDeactivateAccountMutation } from "@/graphql/generated/output"
import { useAuth } from "@/hooks/useAuth"
import { deactivateSchema, type TypeDeactivateSchema } from "@/schemas/auth/deactivate.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { AuthWrapper } from "../AuthWrapper"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/common/Form"
import { FormInput } from "lucide-react"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/common/InputOTP"
import { Input } from "@/components/ui/common/Input"
import { Button } from "@/components/ui/common/Button"
import { parseApolloMessage } from "@/utils/gqlError"

export function DeactivateForm() {

    const translation = useTranslations('auth.deactivate')
    const { exit } = useAuth()
    const route = useRouter()

    const [isShowConfirm, setIsShowConfirm] = useState(false)


    const form = useForm<TypeDeactivateSchema>({
        resolver: zodResolver(deactivateSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const [deactivate, { loading: isLoadingDeactivate }] = useDeactivateAccountMutation({
        onCompleted(data) {
            console.log(data)
            if (data.deactivateAccount.message) {
                setIsShowConfirm(true)
            } else {
                exit()
                toast.success(translation('successMessage'))
                route.push('/')
            }
        },
        onError(error) {
            toast.error(translation(`${parseApolloMessage(error).code}`))
        }
    })

    const { isValid } = form.formState

    function onSubmit(data: TypeDeactivateSchema) {
        deactivate({ variables: { data } })
    }


    return <AuthWrapper
        heading={translation('heading')}
        backButtonLabel={translation('backButtonLabel')}
        backButtonHref='/dashboard/settings'
    >
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-y-3'>
                {isShowConfirm ? (
                    <FormField
                        control={form.control}
                        name='pin'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{translation('pinLabel')}</FormLabel>
                                <FormControl>
                                    <InputOTP maxLength={6} {...field}>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </FormControl>
                                <FormDescription>{translation('pinDescription')}</FormDescription>
                            </FormItem>
                        )}
                    />

                ) : (
                    <>
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{translation('emailLabel')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="email@example.com"
                                            disabled={isLoadingDeactivate}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>{translation('emailDescription')}</FormDescription>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{translation('passwordLabel')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="********"
                                            type='password'
                                            disabled={isLoadingDeactivate}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>{translation('passwordDescription')}</FormDescription>
                                </FormItem>
                            )}
                        />
                    </>
                )}
                <Button className='mt-2 w-full' disabled={!isValid || isLoadingDeactivate}>{translation('submitButton')}</Button>
            </form>
        </Form>
    </AuthWrapper>
}