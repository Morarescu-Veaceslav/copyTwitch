import { cn } from "@/utils/tw-merge"
import type { ComponentProps } from "react"


function Skeleton({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            data-slot="skeleton"
            className={cn("bg-accent dark:bg-muted animate-pulse rounded-lg", className)}
            {...props}
        />
    )
}

export { Skeleton }
