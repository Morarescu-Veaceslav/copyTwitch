import { ResetPasswordForm } from "@/components/features/auth/forms/ResetPasswordForm";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
    const translate = await getTranslations('auth.resetPassword')

    return {
        title: translate('heading')
    }
}


export default function ResetPasswordPage() {
    return <ResetPasswordForm></ResetPasswordForm>
}