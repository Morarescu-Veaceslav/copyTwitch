import { cn } from "@/utils/tw-merge"
import type { ComponentProps } from "react"


function Textarea({ className, ...props }: ComponentProps<"textarea">) {
    return (
        <textarea
            data-slot="textarea"
            className={cn(
                `placeholder:text-muted-foreground aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40
                  aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 max-h-16 w-full rounded-md
                  border border-border px-3 py-2 shadow-xs transition-[color,box-shadow] outline-none 
                  disabled:cursor-not-allowed disabled:opacity-50 text-sm focus:border-primary`,
                className
            )}
            {...props}
        />
    )
}

export { Textarea }
