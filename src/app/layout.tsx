import type { Metadata } from "next";
import "@/styles/globals.css"
import "@/styles/themes.css"
import { ApolloClientProvider } from "@/providers/ApolloClientProvider";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { GeistSans } from 'geist/font/sans'
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import { ColorSwitcher } from "@/components/ui/elements/ColorSwitcher";
import { SITE_KEYWORDS, SITE_NAME } from "@/libs/constants/seo.constants";
import { APP_URL } from "@/libs/constants/url.constants";

export async function generateMetadata(): Promise<Metadata> {
  const translation = await getTranslations("seo");

  return {
    title: {
      absolute: SITE_NAME,
      template: `%s | ${SITE_NAME}`,
    },
    description: translation("description"),
    metadataBase: new URL(APP_URL),
    applicationName: SITE_NAME,
    authors: [
      {
        name: 'Morarescu Veaceslav',
        url: new URL('https://github.com/Morarescu-Veaceslav')
      }
    ],
    keywords: SITE_KEYWORDS,
    generator: 'Next.js',
    creator: 'Morarescu Veaceslav',
    publisher: 'Morarescu  Veaceslav',
    icons: {
      icon: '/images/favicon.svg',
      shortcut: '/images/favicon.svg',
      apple: '/images/256x256.svg',
      other: {
        rel: 'touch-icons',
        url: '/images/256x256.svg',
        sizes: '256x256',
        type: 'images/svg'
      }
    },
    openGraph: {
      title: SITE_NAME,
      description: translation("description"),
      type: 'website',
      locale: 'en_EN',
      images: [
        {
          url: '/images/512x512.svg',
          width: 512,
          height: 512,
          alt: SITE_NAME
        }
      ],
      url: new URL(APP_URL)
    },
    twitter: {
      title: SITE_NAME,
      description: translation("description"),
      images: [
        {
          url: '/images/512x512.svg',
          width: 512,
          height: 512,
          alt: SITE_NAME
        }
      ]
    }
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={GeistSans.variable}
      >
        <ColorSwitcher />
        <ApolloClientProvider>
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
              <ToastProvider />
              {children}
            </ThemeProvider>
          </NextIntlClientProvider>
        </ApolloClientProvider>
      </body>
    </html>
  );
}
