'use client'
import { useForm } from "react-hook-form";
import { AuthWrapper } from "../AuthWrapper";
import { createAccountSchema, type TypeCreateAccountSchema } from "@/schemas/auth/create-account.schema";
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/common/Form";
import { Input } from "@/components/ui/common/Input";
import { Button } from "@/components/ui/common/Button";
import { useCreateUserMutation } from "@/graphql/generated/output";
import { toast } from "sonner";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/common/Alert";
import { CircleCheck } from 'lucide-react'
import { useTranslations } from "next-intl";
import { parseApolloMessage } from "@/utils/gqlError";
export function CreateAccountForm() {
    const translation = useTranslations('auth.register')
    const [isSuccess, setIsSuccess] = useState(false)

    const form = useForm<TypeCreateAccountSchema>({
        resolver: zodResolver(createAccountSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    })

    const [create, { loading: isLoadingCreate }] = useCreateUserMutation({
        onCompleted() {
            toast.success('User registered successfully!')
            setIsSuccess(true)
        },
        onError(error) {
            toast.error(translation(`${parseApolloMessage(error).code}`))
        }
    })

    const { isValid } = form.formState

    function onSubmit(data: TypeCreateAccountSchema) {
        create({ variables: { data } })
    }


    return <AuthWrapper
        heading={translation('heading')}
        backButtonLabel={translation('backButtonLabel')}
        backButtonHref="/account/login"
        homeButtonLabel={translation('homeButton')}
        homeButtonHref='/'
    >
        {isSuccess ? (
            <Alert>
                <CircleCheck className="size-4" />
                <AlertTitle>{translation('successAlertTite')}</AlertTitle>
                <AlertDescription>{translation('successAlertDescription')}</AlertDescription>
            </Alert>
        ) : (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-3">
                    <FormField
                        control={form.control}
                        name='username'
                        render={({ field }) => <FormItem>
                            <FormLabel>{translation('userNameLabel')}</FormLabel>
                            <FormControl>
                                <Input placeholder="Arsen" {...field} disabled={isLoadingCreate} />
                            </FormControl>
                            <FormDescription>{translation('userNameDescription')}</FormDescription>
                        </FormItem>}

                    />
                    <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => <FormItem>
                            <FormLabel>{translation('emailLabel')}</FormLabel>
                            <FormControl>
                                <Input placeholder="arsen@example.com" {...field} disabled={isLoadingCreate} />
                            </FormControl>
                            <FormDescription>{translation('emailDescription')}</FormDescription>
                        </FormItem>}

                    />
                    <FormField
                        control={form.control}
                        name='password'
                        render={({ field }) => <FormItem>
                            <FormLabel>{translation('passwordLabel')}</FormLabel>
                            <FormControl>
                                <Input placeholder="********" type="password" {...field} disabled={isLoadingCreate} />
                            </FormControl>
                            <FormDescription>{translation('passwordDescription')}</FormDescription>
                        </FormItem>}

                    />
                    <Button className="mt-2 w-full" disabled={!isValid || isLoadingCreate}>{translation('submitButton')}</Button>
                </form>
            </Form>
        )}

    </AuthWrapper>
}