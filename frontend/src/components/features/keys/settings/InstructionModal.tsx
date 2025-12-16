import { Button } from "@/components/ui/common/Button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/common/Dialog";
import { useTranslations } from "next-intl";

export function InstructionModal() {
    const translate = useTranslations('dashboard.keys.instructionModal')

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant='secondary'>{translate('trigger')}</Button>
            </DialogTrigger>
            <DialogContent className='max-h-[80vh] max-w-[800px] overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle className='text-xl'>{translate('heading')}</DialogTitle>
                    <DialogDescription className='text-sm text-muted-foreground'>{translate('description')}</DialogDescription>
                </DialogHeader>
                <h2 className='text-lg font-semibold'>{translate('step1Title')}</h2>
                <p className='text-sm text-muted-foreground'>{translate('step1Description')}</p>
                <ol className='list-inside list-decimal space-y-2 pl-4'>
                    <li className='text-sm text-muted-foreground'>
                        <strong>{translate('downloadObs')}</strong>
                        <br />
                        {translate('downloadObsSescription')}{' '}
                        <a
                            href="http://obsproject.com"
                            className='text-blue-500 underline hover:text-blue-700'
                            target="_blank"
                            rel="noopener noreferrer"
                        >{translate('obsLinkText')}</a>.
                    </li>
                    <li className='text-sm text-muted-foreground'>
                        <strong>{translate('copyKeys')}</strong>
                        <br />
                        {translate('copyKeysDescription')}
                    </li>
                </ol>
                <h2 className='mt-4 text-lg font-semibold'>
                    {translate('step2Title')}
                </h2>
                <p className='text-sm text-muted-foreground'>
                    {translate('step2Description')}
                </p>
                <ol className='list-inside list-decimal space-y-2 pl-4'>
                    <li className='text-sm text-muted-foreground'>
                        <strong>{translate('openObs')}</strong>
                        <br />
                        {translate('openObsDescription')}
                    </li>
                    <li className='text-sm text-muted-foreground'>
                        <strong>{translate('openStreamSettings')}</strong>
                        <br />
                        {translate('openStreamSettingsDescription')}
                    </li>
                    <li className='text-sm text-muted-foreground'>
                        <strong>{translate('enterDetails')}</strong>
                        <br />
                        {translate('enterDetailsDescription')}
                    </li>
                    <li className='text-sm text-muted-foreground'>
                        <strong>{translate('saveSettings')}</strong>
                        <br />
                        {translate('saveSettingsDescription')}
                    </li>
                </ol>
                <h2 className='mt-4 text-lg font-semibold'>
                    {translate('step3Title')}
                </h2>
                <p className='text-sm text-muted-foreground'>
                    {translate('step3Description')}
                </p>
                <ol className='list-inside list-decimal space-y-2 pl-4'>
                    <li className='text-sm text-muted-foreground'>
                        <strong>{translate('startStream')}</strong>
                        <br />
                        {translate('startStreamDescription')}
                    </li>
                    <li className='text-sm text-muted-foreground'>
                        <strong>{translate('monitorStream')}</strong>
                        <br />
                        {translate('monitorStreamDescription')}
                    </li>
                </ol>

                <p className='mt-4 text-sm text-muted-foreground'>{translate('congrats')}</p>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant='secondary'>{translate('close')}</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}