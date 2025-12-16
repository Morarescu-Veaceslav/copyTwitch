import { CreateAccountForm } from "@/components/features/auth/forms/CreateAccountForm";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
    const translate = await getTranslations('auth.register')

    return {
        title: translate('heading')
    }
}

export default function CreateAccount() {
    return <CreateAccountForm />
}