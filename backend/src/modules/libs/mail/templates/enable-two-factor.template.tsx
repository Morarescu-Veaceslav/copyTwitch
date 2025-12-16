import * as React from 'react'
import { Body, Head, Heading, Html, Link, Preview, Section, Tailwind, Text } from "@react-email/components";


interface EnableTwoFactorTemplateProps {
    domain: string
}
export function EnableTwoFactorTemplate({ domain }: EnableTwoFactorTemplateProps) {
    const settingsLink = `${domain}/dashboard/settings`
    return (
        <Html>
            <Tailwind>
                <Head />
                <Preview>Enhance your account security with Two-Factor Authentication</Preview>
                <Body className="max-w-2xl mx-auto p-6 bg-slate-50">
                    {/* Header */}
                    <Section className="text-center mb-8">
                        <Heading className="text-3xl text-black font-bold">
                            Secure Your Account
                        </Heading>
                        <Text className="text-base text-black mt-2">
                            Keep your <b>TwitchTest</b> account safe by enabling{" "}
                            <b>Two-Factor Authentication (2FA)</b>.
                        </Text>
                        <Text className="text-base text-black mt-2">
                            With 2FA, even if someone gets your password, they won’t be able to access your account without your verification code.
                        </Text>
                    </Section>

                    {/* Action Section */}
                    <Section className="bg-gray-100 rounded-lg p-6 text-center mb-6">
                        <Heading className="text-2xl text-black font-semibold mb-3">
                            🔐 Protect Your Account
                        </Heading>
                        <Text className="text-base text-gray-800 mb-4">
                            Turn on 2FA today to add an extra layer of security.
                        </Text>
                        <Link
                            href={settingsLink}
                            className="inline-block bg-[#18B9AE] text-white px-6 py-3 rounded-lg text-lg font-semibold no-underline hover:bg-[#14a29a] transition"
                        >
                            Enable Two-Factor Authentication
                        </Link>
                        <Text className="text-sm text-gray-600 mt-4">
                            It only takes a minute — but keeps your account protected all the time.
                        </Text>
                    </Section>

                    {/* Info Section */}
                    <Section className="bg-gray-100 rounded-lg p-6 mb-6">
                        <Heading className="text-xl font-semibold text-[#18B9AE] mb-2">
                            Why enable 2FA?
                        </Heading>
                        <Text className="text-base text-black">
                            • Prevent unauthorized access to your account.<br />
                            • Protect your personal data and settings.<br />
                            • Increase the trust and safety of your channel.
                        </Text>
                    </Section>

                    {/* Footer */}
                    <Section className="text-center mt-8">
                        <Text className="text-gray-600">
                            If you need help setting up Two-Factor Authentication, contact our support team at{" "}
                            <Link
                                href="mailto:help@twitchtest.ru"
                                className="text-[#18B9AE] underline font-medium"
                            >
                                help@twitchtest.ru
                            </Link>.
                        </Text>
                    </Section>
                </Body>
            </Tailwind>
        </Html>

    )
}