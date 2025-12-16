import { NewPasswordForm } from "@/components/features/auth/forms/NewPasswordForm";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";


export async function generateMetadata(): Promise<Metadata> {
    const translate = await getTranslations('auth.newPassword')
    return {
        title: translate('heading')
    }
}

export default function NewPasswordPage() {
    return <NewPasswordForm />
}