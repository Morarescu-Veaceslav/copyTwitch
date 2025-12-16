import * as React from 'react'
import { Body, Head, Heading, Html, Link, Preview, Section, Tailwind, Text } from "@react-email/components";
import { SessionMetadata } from 'src/shared/types/session-metadata.types';
interface DeactivateTemplateProps {
    token: string
    metadata: SessionMetadata
}

export function DeactivateTemplate({ token, metadata }: DeactivateTemplateProps) {

    return (
        <Html>
            <Tailwind>
                <Head />
                <Preview>Account Deletion Request</Preview>
                <Body className="max-w-2xl mx-auto p-6 bg-slate-50">
                    <Section className="text-center mb-8">
                        <Heading className="text-3xl text-black font-bold">
                            Account Deletion Request
                        </Heading>
                        <Text className="text-base text-black mt-2">
                            You have requested to delete your account on <b>TwithTest</b>.
                        </Text>
                        <Text className="text-base text-black mt-2">
                            Please confirm your request by using the verification code below.
                        </Text>
                    </Section>

                    <Section className='bg-gray-100 rounded-lg p-6 text-center mb-6'>
                        <Heading className='text-2xl text-back font-semibold'>Your confirmation code:</Heading>
                        <Heading className='text-3xl text-black font-semibold'>
                            {token}
                        </Heading>
                        <Text className="text-sm text-gray-600 mt-2">This code is valid for 5 minutes.</Text>
                    </Section>

                    <Section className='bg-gray-100 rounded-lg p-6 mb-6'>
                        <Heading className="text-xl font-semibold text-[#18B9AE] mb-2">
                            Information about your session
                        </Heading>
                        <Text className="text-base text-black">
                            We have detected a request for your account from the following session:
                        </Text>
                        <Section className="text-base text-black mt-2">
                            <Text>🌍 <strong>Location:</strong> {metadata.location.country}, {metadata.location.city}</Text>
                            <Text>💻 <strong>Operating System:</strong> {metadata.device.os}</Text>
                            <Text>🌐 <strong>Browser:</strong> {metadata.device.browser}</Text>
                            <Text>🖧 <strong>IP:</strong> {metadata.ip}</Text>
                        </Section>

                        <Text className="text-sm text-gray-600 mt-3">
                            If you did not request a password reset, you can ignore this email.
                        </Text>
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