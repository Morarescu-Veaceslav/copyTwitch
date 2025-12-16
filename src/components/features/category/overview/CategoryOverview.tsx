'use client'

import { Heading } from "@/components/ui/elements/Heading";
import { type FindCategoryBySlugQuery } from "@/graphql/generated/output";
import { getMediaSource } from "@/utils/get-media-source";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { StreamList } from "../../stream/list/StreamList";

interface CategoryOverviewProps {
    category: FindCategoryBySlugQuery['findCategoryBySlug']
}

export function CategoryOverview({ category }: CategoryOverviewProps) {

    const translation = useTranslations('categories.overview')
    return <div className="space-y-8">
        <div className="gap-x-6 lg:flex lg:items-center lg:space-y-6">
            <div className="relative h-[256px] w-[192px] overflow-hidden rounded-xl">
                {category.thumbnailUrl ? (
                    <Image
                        src={getMediaSource(category.thumbnailUrl)}
                        alt={category.title}
                        width={192}
                        height={256}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                        <span className="text-sm text-muted-foreground">
                            No image
                        </span>
                    </div>
                )}
            </div>

            <Heading
                title={category.title}
                description={category.description ?? ''}
                size="xl"
            />
        </div>

        <StreamList
            heading={translation('heading')}
            streams={category.streams}
        />
    </div>

}


