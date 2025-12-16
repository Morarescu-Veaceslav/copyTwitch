'use client'

import { DataTable, DataTableSkeleton } from "@/components/ui/elements/DataTable"
import { Heading } from "@/components/ui/elements/Heading"
import { type FindMyTransactionsQuery, TransactionStatus, useFindMyTransactionsQuery } from "@/graphql/generated/output"
import { convertPrice } from "@/utils/convert-price"
import { formatDate } from "@/utils/format-date"
import { ColumnDef } from "@tanstack/react-table"
import { useTranslations } from "next-intl"

export function TransactionsTable() {

    const translation = useTranslations('dashboard.transactions')

    const { data, loading: isLoadingTransaction } = useFindMyTransactionsQuery()
    const transactions = data?.findMyTransactions ?? []

    const transactionsColumns: ColumnDef<FindMyTransactionsQuery['findMyTransactions'][number]>[] = [
        {
            accessorKey: 'createdAt',
            header: translation('columns.date'),
            cell: ({ row }) => formatDate(row.original.createdAt)
        },
        {
            accessorKey: 'status',
            header: translation('columns.status'),
            cell: ({ row }) => {
                const status = row.original.status
                let statusColor = ''
                switch (status) {
                    case TransactionStatus.Success:
                        statusColor = 'text-green-500'
                        return (
                            <div className={`py-1.5 ${statusColor}`}>
                                {translation('columns.success')}
                            </div>
                        )
                    case TransactionStatus.Pending:
                        statusColor = 'text-yellow-500'
                        return (
                            <div className={`py-1.5 ${statusColor}`}>
                                {translation('columns.pending')}
                            </div>
                        )

                    case TransactionStatus.Failed:
                        statusColor = 'text-red-500'
                        return (
                            <div className={`py-1.5 ${statusColor}`}>
                                {translation('columns.failed')}
                            </div>
                        )
                    case TransactionStatus.Expired:
                        statusColor = 'text-purple-500'
                        return (
                            <div className={`py-1.5 ${statusColor}`}>
                                {translation('columns.expired')}
                            </div>
                        )
                    default:
                        statusColor = 'text-foreground'
                        return (
                            <div className={`py-1.5 ${statusColor}`}>
                                {status}
                            </div>
                        )
                }
            }
        },
        {
            accessorKey: 'amount',
            header: translation('columns.amount'),
            cell: ({ row }) => convertPrice(row.original.amount)
        }
    ]


    return <div className='lg:px-10 w-full'>
        <Heading title={translation('header.heading')} description={translation('header.description')} size='lg' />
        <div className='mt-5'>
            {isLoadingTransaction ? (
                <DataTableSkeleton />
            ) : (
                <DataTable columns={transactionsColumns} data={transactions} />
            )}
        </div>
    </div>
}