import { CardContainer } from "@/components/ui/elements/CardContainer";
import { useFindSessionsByUserQuery, useRemoveSessionMutation, type FindSessionsByUserQuery } from "@/graphql/generated/output";
import { getBrowserIcon } from "@/utils/get-browser-icon";
import { useTranslations } from "use-intl";
import { SessionModal } from "./SessionModal";
import { Button } from "@/components/ui/common/Button";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/elements/ConfirmModal";
import { parseApolloMessage } from "@/utils/gqlError";

type SessionType = NonNullable<
    FindSessionsByUserQuery['findSessionsByUser']
>[number];

interface SessionItemProps {
    session: SessionType
    isCurrentSession?: boolean
}

export function SessionItem({ session, isCurrentSession }: SessionItemProps) {
    const translation = useTranslations('dashboard.settings.sessions.sessionItem')

    const { refetch } = useFindSessionsByUserQuery()
    const [remove, { loading: isLoadingRemove }] = useRemoveSessionMutation({
        onCompleted() {
            refetch()
            toast.success(translation('successMessage'))
        },
        onError(error) {
            console.log('remover')
            toast.error(translation(`${parseApolloMessage(error).code}`))
        }
    })

    const Icon = getBrowserIcon(session?.metadata?.device.browser)

    return <CardContainer
        heading={`${session?.metadata.device.browser}, ${session?.metadata.device.os}`}
        description={`${session?.metadata.location.country}, ${session?.metadata.location.city}`}
        Icon={Icon}
        rightContent={<div className='flex items-center gap-x-4'>
            {!isCurrentSession && (
                <ConfirmModal
                    heading={translation('confirmModal.heading')}
                    message={translation('confirmModal.message')}
                    onConfirm={() => remove({ variables: { id: session?.id } })}
                >
                    <Button variant='secondary' disabled={isLoadingRemove}>{translation('deleteButton')}</Button>
                </ConfirmModal>
            )}
            <SessionModal session={session}>
                <Button>{translation('detailsButton')}</Button>
            </SessionModal>
        </div>}
    />
}