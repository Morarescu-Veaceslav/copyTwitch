'use client'

import { Heading } from "@/components/ui/elements/Heading";
import { type FindMyFollowersQuery, useFindMyFollowersQuery } from "@/graphql/generated/output";
import { useTranslations } from "next-intl";
import type { ColumnDef } from '@tanstack/react-table'
import { formatDate } from "@/utils/format-date";
import { DataTable, DataTableSkeleton } from "@/components/ui/elements/DataTable";
import { ChannelAvatar } from "@/components/ui/elements/ChannelAvatar";
import { ChannelVerified } from "@/components/ui/elements/ChannelVerified";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/common/DropdownMenu";
import { Button } from "@/components/ui/common/Button";
import { MoreHorizontal, User } from "lucide-react";
import Link from "next/link";

export default function FollowersTable() {

    const translation = useTranslations('dashboard.followers')

    const { data, loading: isLoadingFollowers } = useFindMyFollowersQuery()

    const followers = data?.findMyFollowers ?? []

    const followersColumns: ColumnDef<FindMyFollowersQuery['findMyFollowers'][number]>[] = [
        {
            accessorKey: 'createdAt',
            header: translation('columns.date'),
            cell: ({ row }) => formatDate(row.original.createdAt)
        },
        {
            accessorKey: 'follower',
            header: translation('columns.user'),
            cell: ({ row }) => (
                <div className='flex items-center gap-x-2'>
                    <h2>{row.original.follower.username}</h2>
                    {row.original.follower.isVerified && <ChannelVerified size='sm' />}
                </div>
            )
        },
        {
            accessorKey: 'actions',
            header: translation('columns.actions'),
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className="size-8 p-0">
                            <MoreHorizontal className='size-4' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side='right'>
                        <Link href={`/${row.original.follower.username}`} target='_blank'>
                            <DropdownMenuItem className="outline-none">
                                <User className='mr-2 size-4' />
                                {translation('columns.viewChannel')}
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    ]



    return <div className='lg:px-10 w-full'>
        <Heading title={translation('header.heading')} description={translation('header.description')} size='lg' />
        <div className='mt-5'>
            {isLoadingFollowers ? (
                <DataTableSkeleton />
            ) : (
                <DataTable columns={followersColumns} data={followers} />
            )}
        </div>
    </div>
}
