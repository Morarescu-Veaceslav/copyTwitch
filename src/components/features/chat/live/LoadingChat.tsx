import { Card } from "@/components/ui/common/Card";
import { Loader } from "lucide-react";
import { useTranslations } from "next-intl";

export function LoadingChat() {

    const translation = useTranslations('stream.chat')

    return <Card className='flex overflow-y-auto lg:fixed  h-[82%] w-[21.5%] flex-col xl:mt-0
    items-center justify-center'>
        <Loader className='size-10 animate-spin text-muted-foreground' />
        <p className='text-lg mt-3 text-muted-foreground'>{translation('loading')}</p>
    </Card>
}