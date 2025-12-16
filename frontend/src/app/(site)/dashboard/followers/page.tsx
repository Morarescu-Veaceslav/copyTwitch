import FollowersTable from "@/components/features/follow/table/FollowersTable";
import { NO_INDEX_PAGE } from "@/libs/constants/seo.constants";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";


export async function generateMetadata(): Promise<Metadata> {
    const translation = await getTranslations('dashboard.followers.header')

    return {
        title: translation('heading'),
        description: translation('description'),
        ...NO_INDEX_PAGE
    }
}

export default function FollowersPage() {
    return <FollowersTable />
}