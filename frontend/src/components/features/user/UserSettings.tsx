import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/common/Tabs"
import { Heading } from "@/components/ui/elements/Heading"
import { useTranslations } from "next-intl"
import { ChangeAvatarForm } from "./profile/ChangeAvatarFrom"
import { ChangeInfoForm } from "./profile/ChangeInfoForm"
import { SocialLinksForm } from "./profile/social-links-form/SocialLinksForm"
import { ChangeEmailForm } from "./account/ChangeEmailForm"
import { ChangePasswordForm } from "./account/ChangePasswordForm"
import { WrapperTotp } from "./account/totp/WrapperTotp"
import { DeactivateCard } from "./account/DeactivateCard"
import { ChangeThemeForm } from "./appearance/ChangeThemeForm"
import { ChangeLanguageForm } from "./appearance/ChangeLanguageForm"
import { ChangeColorForm } from "./appearance/ChangeColorForm"
import { ChangeNotificationsSettingsForm } from "./notifications/ChangeNotificationsSettingsForm"
import { SessionsList } from "./sessions/SessionsList"

export function UserSettings() {

    const translation = useTranslations('dashboard.settings')
    return <div className='lg:px-10 w-full'>
        <Heading
            title={translation('header.heading')}
            description={translation('header.description')}
            size='lg'
        />
        <Tabs defaultValue="profile" className='mt-3 w-full'>
            <TabsList className='grid max-w-2xl grid-cols-5'>
                <TabsTrigger value="profile">{translation('header.profile')}</TabsTrigger>
                <TabsTrigger value="account">{translation('header.account')}</TabsTrigger>
                <TabsTrigger value="appearance">{translation('header.appearance')}</TabsTrigger>
                <TabsTrigger value="notification">{translation('header.notification')}</TabsTrigger>
                <TabsTrigger value="sessions">{translation('header.sessions')}</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
                <div className='mt-5 space-y-6'>
                    <Heading title={translation('profile.header.heading')} description={translation('profile.header.description')} />
                    <ChangeAvatarForm />
                    <ChangeInfoForm />
                    <SocialLinksForm />
                </div>
            </TabsContent>
            <TabsContent value="account">
                <div className='mt-5 space-y-6'>
                    <Heading title={translation('account.header.heading')} description={translation('account.header.description')} />
                    <ChangeEmailForm />
                    <ChangePasswordForm />
                    <Heading title={translation('account.header.securityHeading')} description={translation('account.header.securityDescription')} />
                    <WrapperTotp />
                    <Heading title={translation('account.header.deactivationHeading')} description={translation('account.header.deactivationDescription')} />
                    <DeactivateCard />
                </div>
            </TabsContent>
            <TabsContent value="appearance">
                <div className='mt-5 space-y-6'>
                    <Heading title={translation('appearance.header.heading')} description={translation('appearance.header.description')} />
                    <ChangeThemeForm />
                    <ChangeLanguageForm />
                    <ChangeColorForm />
                </div>
            </TabsContent>
            <TabsContent value="notification">
                <div className='mt-5 space-y-6'>
                    <Heading title={translation('notifications.header.heading')} description={translation('notifications.header.description')} />
                    <ChangeNotificationsSettingsForm />
                </div>
            </TabsContent>
            <TabsContent value="sessions">
                <div className='mt-5 space-y-6'>
                    <Heading title={translation('sessions.header.heading')} description={translation('sessions.header.description')} />
                    <SessionsList />
                </div>
            </TabsContent>
        </Tabs>
    </div>
}