import { cn } from "@/utils/tw-merge";
import { cva, VariantProps } from "class-variance-authority";


const headingSize = cva('', {
    variants: {
        size: {
            sm: 'text-lg',
            default: 'text-2xl',
            lg: 'text-4xl',
            xl: 'text-5xl'
        }
    },
    defaultVariants: {
        size: 'default'
    }
})


interface HeadingProps extends VariantProps<typeof headingSize> {
    title: string
    description?: string
}

export function Heading({ title, description, size }: HeadingProps) {
    return <div className='space-y-2'>
        <h1 className={cn('font-semibold text-foreground', headingSize({ size }))}>{title}</h1>
        {description && (<p className='text-muted-foreground'>{description}</p>)}
    </div>
}