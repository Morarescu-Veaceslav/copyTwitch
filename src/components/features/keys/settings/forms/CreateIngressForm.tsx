'use client'

import { Button } from "@/components/ui/common/Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/common/Dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/common/Form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/common/Select"
import { useCreateIngressMutation } from "@/graphql/generated/output"
import { useCurrent } from "@/hooks/useCurrent"
import { createIngressSchema, IngressType, type TypeCreateIngressSchema } from "@/schemas/stream/create-ingress.schema"
import { parseApolloMessage } from "@/utils/gqlError"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"


export function CreateIngressForm() {

    const translate = useTranslations('dashboard.keys.createModal')
    const [isOpen, setIsOpen] = useState(false)
    const { refetch } = useCurrent()

    const form = useForm<TypeCreateIngressSchema>({
        resolver: zodResolver(createIngressSchema),
        defaultValues: {
            ingressType: IngressType.RTMP
        }
    })

    const [create, { loading: isLoadingCreate }] = useCreateIngressMutation({
        onCompleted() {
            refetch()
            setIsOpen(false)
            toast.success(translate('successMessage'))
        },
        onError(error) {
            toast.error(translate(`${parseApolloMessage(error).code}`))
        }
    })

    const { isValid } = form.formState

    function onSubmit(data: TypeCreateIngressSchema) {
        create({ variables: { ingressType: data.ingressType } })
    }
    return <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
            <Button>{translate('trigger')}</Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{translate('heading')}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                    <FormField
                        control={form.control}
                        name='ingressType'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{translate('ingressTypeLabel')}</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={value => {
                                            field.onChange(Number(value))
                                        }}
                                        defaultValue={field.value.toString()}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={translate('ingressTypePlaceholder')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem
                                                value={IngressType.RTMP.toString()}
                                                disabled={isLoadingCreate}
                                            >RTMP</SelectItem>
                                            <SelectItem
                                                value={IngressType.WHIP.toString()}
                                                disabled={isLoadingCreate}
                                            >WHIP</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormDescription>{translate('ingressTypeDescription')}</FormDescription>
                            </FormItem>
                        )}
                    />
                    <div className='flex justify-end'>
                        <Button disabled={!isValid || isLoadingCreate}>{translate('submitButton')}</Button>
                    </div>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
}