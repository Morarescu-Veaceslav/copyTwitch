import { cn } from "@/utils/tw-merge";
import { cva, VariantProps } from "class-variance-authority";
import { Check } from "lucide-react";


const channelVerifiedSizes = cva('', {
    variants: {
        size: {
            sm: 'size-3',
            default: 'size-4'
        }
    },
    defaultVariants: {
        size: 'default'
    }
})

interface ChannelVerifiedProps extends VariantProps<typeof channelVerifiedSizes> { }

export function ChannelVerified({ size }: ChannelVerifiedProps) {
    return (
        <span className={cn('flex items-center justify-center rounded-full bg-primary p-0.5')}>
            <Check className={cn('stroke-[4px] text-white', size === 'sm' ? 'size-2' : 'size-[11px]')} />
        </span>
    )
}