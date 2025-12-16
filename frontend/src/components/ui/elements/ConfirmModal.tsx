'use client'
import { useTranslations } from "next-intl";
import { PropsWithChildren } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../common/AlertDialog";
import { Button } from "../common/Button";

interface ConfirmModalPropa {
    heading: string
    message: string
    onConfirm: () => void
}

export function ConfirmModal({ children, heading, message, onConfirm }: PropsWithChildren<ConfirmModalPropa>) {

    const translation = useTranslations('components.confirmModal')
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{heading}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {message}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{translation('cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>{translation('continue')}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}