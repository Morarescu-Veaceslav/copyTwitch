import { Card } from "@/components/ui/common/Card"
import { Loader } from "lucide-react"
import { useTranslations } from "next-intl"

export function LoadingStream() {
    const translation = useTranslations('stream.video')


    return <Card className='relative flex h-full flex-col items-center justify-center'>
        <Loader className='size-12 animate-spin text-muted-foreground' />
        <p className='mt-3 text-lg text-muted-foreground'>
            {translation('loading')}
        </p>
    </Card>
}