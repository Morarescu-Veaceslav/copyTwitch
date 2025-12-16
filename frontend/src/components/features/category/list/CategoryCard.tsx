'use client'

import type { FindRandomCategoriesQuery } from "@/graphql/generated/output";
import { useSidebar } from "@/hooks/useSidebar";
import { getRandomColor } from "@/utils/color";
import { cn } from "@/utils/tw-merge";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image"
import { getMediaSource } from "@/utils/get-media-source";
import { Card } from "@/components/ui/common/Card";
import { ChannelAvatar } from "@/components/ui/elements/ChannelAvatar";

interface CategoryCardProps {
    category: FindRandomCategoriesQuery['findRandomCategories'][number]
}

export function CategoryCard({ category }: CategoryCardProps) {

    const [randomColor, setRandomColor] = useState('')
    const { isCollapsed } = useSidebar()

    useEffect(() => {
        setRandomColor(getRandomColor())
    }, [])



    return <Link href={`/categories/${category.slug}`} className="h-full w-full space-y-3">
        <div
            className={cn(
                'group relative cursor-pointer overflow-hidden rounded-xl',
                isCollapsed ? 'h-60' : 'h-52'
            )}
        >
            <div
                className="absolute inset-0 flex items-center justify-center rounded-xl
                 transition-opacity"
                style={{ backgroundColor: randomColor }}
            >
                {category.thumbnailUrl ? (
                    <Image
                        src={getMediaSource(category.thumbnailUrl)}
                        alt={category.title}
                        fill
                        className="rounded-xl object-cover transition-transform
                     group-hover:-translate-y-2
                     group-hover:translate-x-2"
                    />
                ) : (
                    <div
                        className="flex h-full w-full flex-col items-center justify-center
                     text-white/80 transition-transform
                     group-hover:-translate-y-2
                     group-hover:translate-x-2"
                    >
                        <span className="text-xs uppercase tracking-widest opacity-80">
                            No image
                        </span>
                        <span className="mt-1 text-lg font-semibold">
                            {category.title}
                        </span>
                    </div>
                )}
            </div>
        </div>

        <h2 className="truncate text-base font-semibold text-foreground hover:text-primary">
            {category.title}
        </h2>
    </Link>

}