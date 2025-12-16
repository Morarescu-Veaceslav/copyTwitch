'use client'

import { useLoginUserMutation } from "@/graphql/generated/output"
import { loginSchema, type TypeLoginSchema } from "@/schemas/auth/login.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { AuthWrapper } from "../AuthWrapper"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/common/Form"
import { Input } from "@/components/ui/common/Input"
import { Button } from "@/components/ui/common/Button"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/common/InputOTP"
import Link from "next/link"
import { da } from "zod/v4/locales"
import { useAuth } from "@/hooks/useAuth"
import { parseApolloMessage } from "@/utils/gqlError"

export function LoginForm() {

    const translation = useTranslations('auth.login')
    const { auth } = useAuth()
    const router = useRouter()
    const [isShowTwoFactor, setIsShowTwoFactor] = useState(false)

    const form = useForm<TypeLoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            login: '',
            password: ''
        },
        mode: "onChange"
    })

    const [login, { loading: isLoadingLogin }] = useLoginUserMutation({
        onCompleted(data) {

            const { user, message } = data.loginUser;

            if (user) {
                // Dacă avem utilizator și OTP nu e activ
                auth()
                toast.success(translation('successMessage'));
                router.push('/dashboard/settings');
                return;
            }

            if (message) {
                // Dacă OTP e activ
                auth()
                setIsShowTwoFactor(true);
                form.setValue("pin", "");
                form.trigger();
                return;
            }

            // Dacă ajunge aici, e un caz neașteptat
            toast.error(translation('LOGIN_ERROR'));
        },
        onError(error) {
            toast.error(translation(`${parseApolloMessage(error).code}`))
        }
    })

    const { isValid } = form.formState

    function onSubmit(data: TypeLoginSchema) {
        login({
            variables: {
                data: {
                    login: data.login,
                    password: data.password,
                    pin: data.pin ? data.pin : null
                }
            }
        })
    }

    return (
        <AuthWrapper
            heading={translation('heading')}
            backButtonLabel={translation('backButtonLabel')}
            backButtonHref='/account/create'
            homeButtonLabel={translation('homeButton')}
            homeButtonHref='/'
        >

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-3">

                    {isShowTwoFactor ? (
                        <FormField
                            control={form.control}
                            name="pin"
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
                                name='login'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{translation('loginLabel')}</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="arsen"
                                                disabled={isLoadingLogin}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>{translation('loginDescription')}</FormDescription>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='password'
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center justify-between" >
                                            <FormLabel>{translation('passwordLabel')}</FormLabel>
                                            <Link href='/account/recovery' className='ml-auto inline-block text-sm'>{translation('forgotPassword')}</Link>
                                        </div>
                                        <FormControl>
                                            <Input
                                                placeholder="********"
                                                type='password'
                                                disabled={isLoadingLogin}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>{translation('passwordDescription')}</FormDescription>
                                    </FormItem>
                                )}
                            />
                        </>
                    )}
                    <Button className="mt-2 w-full" disabled={!isValid || isLoadingLogin}>{translation('submitButton')}</Button>
                </form>
            </Form>
        </AuthWrapper>
    )
}