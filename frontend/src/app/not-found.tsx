"use client";

import { Button } from "@/components/ui/common/Button";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function NotFoundPage() {
    const translation = useTranslations('notFound')

    return (
        <div className="flex h-[80vh] w-full flex-col items-center justify-center px-6">
            <div className="text-center space-y-6 animate-fadeIn">
                <h1 className="text-7xl sm:text-9xl font-extrabold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
                    404
                </h1>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                    {translation("description")}
                </p>
                <Link href="/" className="inline-block">
                    <Button className="px-8 py-3 text-base rounded-xl hover:scale-105 transition-transform">
                        {translation("backToHome")}
                    </Button>
                </Link>
            </div>
        </div>
    )
}
