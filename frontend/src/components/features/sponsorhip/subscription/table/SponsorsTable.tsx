'use client'

import { Button } from "@/components/ui/common/Button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/common/DropdownMenu"
import { ChannelVerified } from "@/components/ui/elements/ChannelVerified"
import { DataTable, DataTableSkeleton } from "@/components/ui/elements/DataTable"
import { Heading } from "@/components/ui/elements/Heading"
import { type FindMySponsorsQuery, useFindMySponsorsQuery } from "@/graphql/generated/output"
import { formatDate } from "@/utils/format-date"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, User } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"

export function SponsorsTable() {

    const translation = useTranslations('dashboard.sponsors')

    const { data, loading: isLoadingSponsors } = useFindMySponsorsQuery()

    const sponsors = data?.findMySponsors ?? []

    const sponsorsColumns: ColumnDef<FindMySponsorsQuery['findMySponsors'][number]>[] = [
        {
            accessorKey: 'expiresAt',
            header: translation('columns.user'),
            cell: ({ row }) => formatDate(row.original.expiresAt)
        },
        {
            accessorKey: 'user',
            header: translation('columns.user'),
            cell: ({ row }) => (
                <div className='flex items-center gap-x-2'>
                    <h2>{row.original.user.username}</h2>
                    {row.original.user.isVerified && <ChannelVerified size='sm' />}
                </div>
            )
        },
        {
            accessorKey: 'plan',
            header: translation('columns.plan'),
            cell: ({ row }) => row.original.plan.title
        },
        {
            accessorKey: 'actions',
            header: translation('columns.actions'),
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className='size-8 p-0'>
                            <MoreHorizontal className='size-4' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side='right'>
                        <Link href={`/${row.original.user.username}`} target='_blank'>
                            <DropdownMenuItem>
                                <User className='mr-2 size-4' />
                                {translation('columns.viewChannel')}
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    ]

    return (
        <div className='lg:px-10 w-full'>
            <Heading title={translation('header.heading')} description={translation('header.description')} size='lg' />
            <div className='mt-5'>
                {isLoadingSponsors ? (
                    <DataTableSkeleton />
                ) : (
                    <DataTable columns={sponsorsColumns} data={sponsors} />
                )}
            </div>
        </div>
    )

}