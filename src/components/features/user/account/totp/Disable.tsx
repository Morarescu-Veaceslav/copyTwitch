import { Button } from "@/components/ui/common/Button"
import { ConfirmModal } from "@/components/ui/elements/ConfirmModal"
import { useDisableTotpMutation } from "@/graphql/generated/output"
import { useCurrent } from "@/hooks/useCurrent"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

export function DisableTotp() {

    const translation = useTranslations('dashboard.settings.account.twoFactor.disabled')

    const { refetch } = useCurrent()

    const [disable, { loading: isLoadingDisable }] = useDisableTotpMutation({
        onCompleted() {
            refetch()
            toast.success(translation('successMessage'))
        },
        onError() {
            toast.error(translation('errorMessage'))
        }
    })

    return <ConfirmModal
        heading={translation('heading')}
        message={translation('message')}
        onConfirm={() => disable()}
    >
        <Button variant='secondary' disabled={isLoadingDisable}>{translation('trigger')}</Button>
    </ConfirmModal>
}