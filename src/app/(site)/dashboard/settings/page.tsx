import { UserSettings } from "@/components/features/user/UserSettings";
import { NO_INDEX_PAGE } from "@/libs/constants/seo.constants";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";


export async function generateMetadata(): Promise<Metadata> {
    const translate = await getTranslations('dashboard.settings.header')

    return {
        title: translate('heading'),
        description: translate('description'),
        ...NO_INDEX_PAGE
    }
}

export default function SettingsPage() {
    return <UserSettings />
}