import { Button } from "@/components/ui/common/Button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/common/Form";
import { Input } from "@/components/ui/common/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/common/Select";
import { Separator } from "@/components/ui/common/Separator";
import { FindChannelByUsernameQuery, useChangeStreamInfoMutation, useFindAllCategoriesQuery } from "@/graphql/generated/output";
import { changeStreamInfoSchema, type TypeChangeStreamInfoSchema } from "@/schemas/stream/change-stream-info.chema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ChangeThumbnailFormProps {
    stream: FindChannelByUsernameQuery['findChannelByUsername']['stream']
}


export function ChangeInfoForm({ stream }: ChangeThumbnailFormProps) {
    const tranlation = useTranslations('stream.settings.info')

    const { data, refetch } = useFindAllCategoriesQuery()

    const categories = data?.findAllCategories ?? []

    const form = useForm<TypeChangeStreamInfoSchema>({
        resolver: zodResolver(changeStreamInfoSchema),
        values: {
            title: stream?.title ?? '',
            categoryId: stream?.category?.id ?? ''
        }
    })


    const [update, { loading: isLoadingUpdate }] = useChangeStreamInfoMutation({
        onCompleted() {
            refetch()
            toast.success(tranlation('successMessage'))
        },
        onError() {
            toast.error(tranlation('errorMessage'))
        }
    })

    const { isValid } = form.formState

    function onSubmit(data: TypeChangeStreamInfoSchema) {
        update({ variables: { data } })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-2'>
                <FormField
                    control={form.control}
                    name='title'
                    render={({ field }) => (
                        <FormItem className='pb-3'>
                            <FormLabel>{tranlation('titleLabel')}</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder={tranlation('titlePlaceholder')}
                                    disabled={isLoadingUpdate}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                {tranlation('titleDescription')}
                            </FormDescription>
                        </FormItem>
                    )}

                />

                <FormField
                    control={form.control}
                    name='categoryId'
                    render={({ field }) => (
                        <FormItem className='pb-3'>
                            <FormLabel>{tranlation('categoryLabel')}</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue
                                            placeholder={tranlation('categoryPlaceholder')}
                                        />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className='p-0 '>
                                    {categories.map(category => (
                                        <SelectItem
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <FormDescription>
                                {tranlation('categoryDescription')}
                            </FormDescription>
                        </FormItem>
                    )}
                />

                <div className='flex justify-end pt-5'>
                    <Button disabled={!isValid || isLoadingUpdate}>
                        {tranlation('submitButton')}
                    </Button>
                </div>
            </form>
        </Form>
    )
}