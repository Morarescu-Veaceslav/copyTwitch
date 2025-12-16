
import { Loader } from "lucide-react";
import { Card } from "@/components/ui/common/Card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../common/Table"
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    ColumnDef,
} from "@tanstack/react-table"

export function DataTable<TData, TValue>({
    columns,
    data,
}: {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}) {

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <Table >
            <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <TableHead
                                key={header.id}
                            >
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                            </TableHead>
                        ))}
                    </TableRow>
                ))}
            </TableHeader>

            <TableBody>
                {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                        <TableRow
                            key={row.id}
                        >
                            {row.getVisibleCells().map((cell) => (
                                <TableCell
                                    key={cell.id}
                                >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell
                            colSpan={table.getAllColumns().length}
                            className="h-24 text-center text-muted-foreground"
                        >
                            No results.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>

    )
}


export function DataTableSkeleton() {
    return (
        <div className='max-w-screen-xl mx-auto w-full mb-10'>
            <Card className='mt-6 flex h-[500px] w-full items-center justify-center'>
                <Loader className='animate-spin size-8 text-muted-foreground' />
            </Card>
        </div>
    )
}