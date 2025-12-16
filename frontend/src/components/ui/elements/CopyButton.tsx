import { Check, Copy } from "lucide-react";
import { PropsWithChildren, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "use-intl";
import { Button } from "../common/Button";

interface CopyButtonProps {
    value: string | null
}

export function CopyButton({ value }: CopyButtonProps) {

    const translate = useTranslations('components.copyButton')

    const [isCopied, setIsCopied] = useState(false)

    function onCopy() {
        if (!value) return

        setIsCopied(true)
        navigator.clipboard.writeText(value)
        toast.success(translate('successMessage'))
        setTimeout(() => {
            setIsCopied(false)
        }, 2000)
    }

    const Icon = isCopied ? Check : Copy

    return <Button variant='ghost' size='lgIcon' onClick={() => onCopy()} disabled={!value || isCopied}><Icon className='size-5' /></Button>
}