import { Input } from "@/components/ui/common/Input"
import { CardContainer } from "@/components/ui/elements/CardContainer"
import { CopyButton } from "@/components/ui/elements/CopyButton"
import { useTranslations } from "use-intl"


interface StreamURlProps {
    value: string | null
}


export function StreamURL({ value }: StreamURlProps) {

    const translate = useTranslations('dashboard.keys.url')

    return <CardContainer heading={translate('heading')} isRightContentFull rightContent={<div className='flex w-full items-center gap-x-4'>
        <Input placeholder={translate('heading')} value={value ?? ''} disabled />
        <CopyButton value={value} />
    </div>} />

}