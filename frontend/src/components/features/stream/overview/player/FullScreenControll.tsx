import { Button } from "@/components/ui/common/Button"
import { Hint } from "@/components/ui/elements/Hint"
import { useTranslations } from "next-intl"
import { Maximize, Minimize } from "lucide-react"



interface FullScreenControllProps {
    isFullScreen: boolean
    onToggle: () => void
}

export function FullScreenControll({ isFullScreen, onToggle }: FullScreenControllProps) {

    const translation = useTranslations('stream.video.player.fullscreen')

    const Icon = isFullScreen ? Minimize : Maximize



    return <div className='flex items-center justify-center gap-4'>
        <Hint label={isFullScreen ? translation('exit') : translation('open')} asChild>
            <Button
                variant='ghost'
                size='icon'
                onClick={onToggle}
                className='text-white hover:bg-white/10'
            >
                <Icon className='size-6' />
            </Button>
        </Hint>
    </div>
}