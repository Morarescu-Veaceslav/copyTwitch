import * as React from 'react'
import { Body, Head, Heading, Html, Link, Preview, Section, Tailwind, Text } from "@react-email/components";


export function VerifyChannelTemplate() {
    return (
        <Html>
            <Tailwind>
                <Head />
                <Preview>Your channel has been verified on TwitchTest</Preview>
                <Body className="max-w-2xl mx-auto p-6 bg-slate-50">
                    {/* Header */}
                    <Section className="text-center mb-8">
                        <Heading className="text-3xl text-black font-bold">
                            🎉 Congratulations! Your Channel is Verified
                        </Heading>
                        <Text className="text-base text-black mt-2">
                            We’re excited to let you know that your channel on <b>TwitchTest</b> has been officially verified.
                        </Text>
                        <Text className="text-base text-black mt-2">
                            You’ll now see a verification badge next to your channel name — a mark of authenticity and trust for your viewers.
                        </Text>
                    </Section>

                    {/* Info Section */}
                    <Section className="bg-gray-100 rounded-lg p-6 mb-6">
                        <Heading className="text-xl font-semibold text-[#18B9AE] mb-2">
                            What does verification mean?
                        </Heading>
                        <Text className="text-base text-black">
                            • Your channel is recognized as an official, trusted creator.<br />
                            • Viewers can easily identify and follow your authentic content.<br />
                            • You gain access to upcoming creator tools and features on TwitchTest.
                        </Text>
                    </Section>

                    {/* Next Steps */}
                    <Section className="bg-gray-100 rounded-lg p-6 text-center mb-6">
                        <Heading className="text-2xl text-black font-semibold mb-3">
                            ✅ Display Your Badge with Pride
                        </Heading>
                        <Text className="text-base text-gray-800 mb-4">
                            Your verification badge has already been added to your profile.
                            You can view it anytime in your channel settings.
                        </Text>
                        <Link
                            href="http://twitchtest.app/dashboard/settings"
                            className="inline-block bg-[#18B9AE] text-white px-6 py-3 rounded-lg text-lg font-semibold no-underline hover:bg-[#14a29a] transition"
                        >
                            View Channel Settings
                        </Link>
                    </Section>

                    {/* Appreciation */}
                    <Section className="text-center mb-8">
                        <Text className="text-base text-black">
                            Thank you for being a valued member of our community.
                            Your dedication and creativity help make <b>TwitchTest</b> a better place for everyone.
                        </Text>
                    </Section>

                    {/* Footer */}
                    <Section className="text-center mt-8">
                        <Text className="text-gray-600">
                            If you have any questions about your verification status, please contact our support team at{" "}
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