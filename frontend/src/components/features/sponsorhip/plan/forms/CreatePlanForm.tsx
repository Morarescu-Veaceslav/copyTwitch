import { Button } from "@/components/ui/common/Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/common/Dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/common/Form"
import { Input } from "@/components/ui/common/Input"
import { Textarea } from "@/components/ui/common/Textarea"
import { useCreateSponsorshipPlanMutation, useFindMySponsorshipPlansQuery } from "@/graphql/generated/output"
import { createPlanSchema, type TypeCreatePlanSchema } from "@/schemas/plan/create-plan.schema"
import { parseApolloMessage } from "@/utils/gqlError"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Resolver, useForm } from "react-hook-form"
import { toast } from "sonner"
import { useTranslations } from "use-intl"


export function CreatePlanForm() {

    const translation = useTranslations('dashboard.plans.createForm')

    const [isOpen, setIsOpen] = useState(false)
    const { refetch } = useFindMySponsorshipPlansQuery()

    const form = useForm<TypeCreatePlanSchema>({
        resolver: zodResolver(createPlanSchema) as unknown as Resolver<TypeCreatePlanSchema>,
        defaultValues: {
            title: '',
            description: '',
            price: 0
        },
        mode: 'onChange',
    })

    const [create, { loading: isLoadingCreate }] = useCreateSponsorshipPlanMutation({
        onCompleted() {
            setIsOpen(false)
            form.reset()
            refetch()
            toast.success(translation('successMessage'))
        },
        onError(error) {
            toast.error(translation(`${parseApolloMessage(error).code}`))
        }
    })


    const { isValid } = form.formState

    function onSubmit(data: TypeCreatePlanSchema) {
        create({ variables: { data } })
    }
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>{translation('trigger')}</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{translation('heading')}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                        <FormField
                            control={form.control}
                            name='title'
                            render={({ field }) => (
                                <FormItem>
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

                        <FormField
                            control={form.control}
                            name='description'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{translation('descriptionLabel')}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder={translation('descriptionPlaceholder')}
                                            disabled={isLoadingCreate}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>{translation('descriptionDescription')}</FormDescription>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='price'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{translation('priceLabel')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={translation('pricePlaceholder')}
                                            disabled={isLoadingCreate}
                                            type='number'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>{translation('priceDescription')}</FormDescription>
                                </FormItem>
                            )}
                        />

                        <div className='flex justify-end'>
                            <Button disabled={!isValid || isLoadingCreate}>
                                {translation('submitButton')}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}