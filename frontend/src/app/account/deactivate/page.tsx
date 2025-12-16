import { DeactivateForm } from "@/components/features/auth/forms/DeactivateForm";
import { NO_INDEX_PAGE } from "@/libs/constants/seo.constants";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";


export async function generateMetadata(): Promise<Metadata> {
    const translation = await getTranslations('auth.deactivate')

    return {
        title: translation('heading'),
        ...NO_INDEX_PAGE
    }
}
export default function DeactivatePage() {
    return <DeactivateForm />
}