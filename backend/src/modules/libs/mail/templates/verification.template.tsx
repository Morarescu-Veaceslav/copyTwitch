import * as React from 'react'
import { Body, Head, Heading, Html, Link, Preview, Section, Tailwind, Text } from "@react-email/components";
interface VerificationTemplateProps {
    domain: string
    token: string
}
export function VerificationTemplate({ domain, token }: VerificationTemplateProps) {
    const verificationLink = `${domain}/account/verify?token=${token}`

    return (
        <Html>
            <Tailwind>
                <Head />
                <Preview>Account Verification</Preview>
                <Body className="max-w-2xl mx-auto p-6 bg-slate-50">
                    <Section className="text-center mb-8">
                        <Heading className="text-3xl text-black font-bold">Email Confirmation</Heading>
                        <Text className="text-base text-black mt-2">
                            To confirm your email address, please click the button below:
                        </Text>

                        <Link
                            href={verificationLink}
                            className="inline-flex justify-center items-center rounded-full text-sm font-medium text-white bg-[#18B9AE] px-6 py-2 mt-4 no-underline"
                        >
                            Confirm Email
                        </Link>
                    </Section>

                    <Section className="text-center mt-8">
                        <Text className="text-gray-600">
                            If you have any questions or encounter any difficulties, please don’t hesitate to contact us at{" "}
                            <Link
                                href="mailto:help@twichTest.ru"
                                className="text-[#18B9AE] underline font-medium"
                            >
                                help@twichTest.ru
                            </Link>.
                        </Text>
                    </Section>
                </Body>
            </Tailwind>
        </Html>
    )
}