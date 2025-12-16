'use client'

import { useCurrent } from "@/hooks/useCurrent"
import { useTranslations } from "next-intl"
import { VerifiedChannelAlert } from "./VerifiedChannelAlert"
import { Heading } from "@/components/ui/elements/Heading"
import { CreatePlanForm } from "../forms/CreatePlanForm"
import { FindMySponsorshipPlansQuery, useFindMySponsorshipPlansQuery, useRemoveSponsorshipPlanMutation } from "@/graphql/generated/output"
import { ColumnDef } from "@tanstack/react-table"
import { formatDate } from "@/utils/format-date"
import { convertPrice } from "@/utils/convert-price"
import { toast } from "sonner"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/common/DropdownMenu"
import { MoreHorizontal, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/common/Button"
import { DataTable, DataTableSkeleton } from "@/components/ui/elements/DataTable"
import { parseApolloMessage } from "@/utils/gqlError"


export function PlansTable() {
    const translation = useTranslations('dashboard.plans')

    const { user } = useCurrent()

    const { data, loading: isLoadingPlans, refetch } = useFindMySponsorshipPlansQuery()
    const plans = data?.findMySponsorshipPlans ?? []

    const plansColumns: ColumnDef<FindMySponsorshipPlansQuery['findMySponsorshipPlans'][number]>[] = [
        {
            accessorKey: 'createdAt',
            header: translation('columns.date'),
            cell: ({ row }) => formatDate(row.original.createdAt)
        },
        {
            accessorKey: 'title',
            header: translation('columns.title'),
            cell: ({ row }) => row.original.title
        },
        {
            accessorKey: 'price',
            header: translation('columns.price'),
            cell: ({ row }) => convertPrice(row.original.price)
        },
        {
            accessorKey: 'actions',
            header: translation('columns.actions'),
            cell: ({ row }) => {
                const [remove, { loading: isLoadingRemove }] = useRemoveSponsorshipPlanMutation({
                    onCompleted() {
                        refetch()
                        toast.success(translation('columns.successMessage'))
                    },
                    onError(error) {
                        toast.error(translation(`${parseApolloMessage(error).code}`))
                    }
                })
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant='ghost' className='size-8 p-0'>
                                <MoreHorizontal className='size-4' />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side='right'>
                            <DropdownMenuItem
                                onClick={() => remove({ variables: { data: row.original.id } })}
                                className='text-red-500 focus:text-red-500'
                                disabled={isLoadingRemove}
                            >
                                <Trash2 className='mr-2 size-4' />
                                {translation('columns.remove')}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        }
    ]


    return user?.isVerified
        ?
        <div className='lg:px-10 w-full'>
            <div className='block items-center justify-between space-y-3 lg:flex lg:space-y-0'>
                <Heading title={translation('header.heading')} description={translation('header.description')} size='lg' />
                <CreatePlanForm />
            </div>
            <div className='mt-5'>
                {isLoadingPlans ? (
                    <DataTableSkeleton />
                ) : (
                    <DataTable columns={plansColumns} data={plans} />
                )}
            </div>
        </div>
        :
        <VerifiedChannelAlert />
}