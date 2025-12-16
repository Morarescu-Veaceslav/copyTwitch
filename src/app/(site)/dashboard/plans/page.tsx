import { PlansTable } from "@/components/features/sponsorhip/plan/table/PlansTable";
import { NO_INDEX_PAGE } from "@/libs/constants/seo.constants";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";


export async function generateMetadata(): Promise<Metadata> {
    const translation = await getTranslations('dashboard.plans.header')

    return {
        title: translation('heading'),
        description: translation('description'),
        ...NO_INDEX_PAGE
    }
}

export default function PlansPage() {
    return <PlansTable />
}