'use client'

import { useVerifyAccountMutation } from "@/graphql/generated/output"
import { useTranslations } from "next-intl"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"
import { AuthWrapper } from "../AuthWrapper"
import { Loader } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { parseApolloMessage } from "@/utils/gqlError"

export function VerifyAccountForm() {

    const translation = useTranslations('auth.verify')
    const { auth } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token') ?? ''

    const [verify] = useVerifyAccountMutation({
        onCompleted() {
            auth()
            toast.success(translation('successMessage'))
            router.push('/dashboard/settings')
        },

        onError(error) {
            toast.error(translation(`${parseApolloMessage(error).code}`))
        }

    })

    useEffect(() => {
        verify({
            variables: {
                data: { token }
            }
        })
    }, [token])

    return (
        <AuthWrapper heading={translation('heading')}>
            <div className="flex justify-center">
                <Loader className="size-8 animate-spin" />
            </div>
        </AuthWrapper>
    )
}