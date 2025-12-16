import { SITE_NAME } from "@/libs/constants/seo.constants";
import { MetadataRoute } from "next";
import { getTranslations } from "next-intl/server";



export default async function manifest(): Promise<MetadataRoute.Manifest> {

    const translation = await getTranslations("seo");
    return {
        name: SITE_NAME,
        description: translation("description"),
        start_url: 'account/login',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#1F2128',
        theme_color: '#9146FF',
        icons: [
            {
                src: '/images/256x256.svg',
                sizes: '256x256',
                type: 'images/svg'
            },
            {
                src: '/images/512x512.svg',
                sizes: '512x512',
                type: 'images/svg'
            }
        ]
    }
}