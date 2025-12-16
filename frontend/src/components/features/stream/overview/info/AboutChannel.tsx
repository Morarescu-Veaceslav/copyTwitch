import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/common/Card";
import { Skeleton } from "@/components/ui/common/Skeleton";
import type { FindChannelByUsernameQuery } from "@/graphql/generated/output";
import { getSocialIcon } from "@/utils/get-social-icon";
import Link from "next/link";
import { useTranslations } from "use-intl";


interface AboutChannelProps {
    channel: FindChannelByUsernameQuery['findChannelByUsername']
}


export function AboutChannel({ channel }: AboutChannelProps) {

    const translation = useTranslations('stream.aboutChannel')
    return <Card className='mt-6'>
        <CardHeader className='p-4'>
            <CardTitle className='text-xl'>
                {translation('heading')} {channel.displayName}
            </CardTitle>
        </CardHeader>
        <CardContent className='space-y-2 px-4 -mt-3'>
            <div className='text-[15px] text-foreground'>
                <span className='font-semibold'>{channel.followings.length}</span>
                {' '}   {translation('followersCount')}
            </div>
            <div className='text-[15px] text-muted-foreground'>
                {channel.bio ?? translation('noDescription')}
            </div>
            {channel.socialLinks.length ? (
                <div className='grid gap-x-3 md:grid-cols-3 xl:grid-cols-8'>
                    {channel.socialLinks.map((socialLinks, index) => {

                        const Icon = getSocialIcon(socialLinks.url)

                        return (
                            <Link key={index} href={socialLinks.url} className='flex items-center
                            pr-1 text-[15px] hover:text-primary' target='_blank'>
                                <Icon className='size-4 mr-2' />
                                {socialLinks.title}
                            </Link>
                        )
                    })}
                </div>
            ) : null}
        </CardContent>
    </Card>
}



export function AboutChannelSkeleton() {
    return (
        <Skeleton className='mt-6 h-36 w-full' />
    )
}
