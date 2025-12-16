'use client'

import { Button } from "@/components/ui/common/Button"
import { useAuth } from "@/hooks/useAuth"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { ProfileMenu } from "./ProfileMenu"

export function HeaderMenu() {

    const translate = useTranslations('layout.header.headerMenu')
    const { isAuthenticated } = useAuth()

    return <div className="flex ml-auto items-center gap-x-4">
        {isAuthenticated ? (
            <ProfileMenu />
        ) : (
            <>
                <Link href='/account/login'>
                    <Button>{translate('login')}</Button>
                </Link>
                <Link href='/account/create'>
                    <Button>{translate('register')}</Button>
                </Link>
            </>
        )}
    </div>
}