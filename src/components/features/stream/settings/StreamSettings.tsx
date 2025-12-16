import { Button } from "@/components/ui/common/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/common/Dialog";
import type { FindChannelByUsernameQuery } from "@/graphql/generated/output";
import { useCurrent } from "@/hooks/useCurrent";
import { Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import { ChangeThumbnailForm } from "./ChangeThumbnailForm";
import { ChangeInfoForm } from "./ChangeInfoForm";


interface StreamSettingsProps {
    channel: FindChannelByUsernameQuery['findChannelByUsername']
}

export function StreamSettings({ channel }: StreamSettingsProps) {

    const translation = useTranslations('stream.settings')
    const { user } = useCurrent()
    const isOwnerChannel = user?.id === channel.id

    if (!isOwnerChannel) return null

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant='ghost' size='lgIcon'>
                    <Pencil className='size-5' />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{translation('heading')}</DialogTitle>
                </DialogHeader>
                <ChangeThumbnailForm stream={channel.stream} />
                <ChangeInfoForm stream={channel.stream} />
            </DialogContent>
        </Dialog>
    )
}