import { LoginForm } from "@/components/features/auth/forms/LoginAccountForm";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";


export async function generateMetadata(): Promise<Metadata> {
    const translate = await getTranslations('auth.login')
    return {
        title: translate('heading')
    }
}

export default function LoginPage() {
    return <LoginForm />
}