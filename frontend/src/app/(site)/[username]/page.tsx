import { StreamOverview } from "@/components/features/stream/overview/StreamOverview";
import { FindChannelByUsernameDocument, type FindChannelByUsernameQuery } from "@/graphql/generated/output";
import { SERVER_URL } from "@/libs/constants/url.constants";
import { getMediaSource } from "@/utils/get-media-source";
import { Metadata } from "next";
import { notFound } from "next/navigation";


async function findChannelByUsername(params: { username: string }) {
    try {
        const query = FindChannelByUsernameDocument.loc?.source.body
        const variables = { username: params.username }

        const response = await fetch(SERVER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables }),
            next: { revalidate: 30 }
        })

        const data = await response.json()

        if (data.errors?.length) {
            return {
                channel: null,
                errorCode: data.errors[0].extensions?.code
            }
        }

        return {
            channel: data?.data?.findChannelByUsername ?? null,
            errorCode: null
        }
    } catch (error) {
        return {
            channel: null,
            errorCode: 'FETCH_ERROR'
        }
    }
}


export async function generateMetadata(props: {
    params: Promise<{ username: string }>
}): Promise<Metadata> {
    const params = await props.params

    const { channel } = await findChannelByUsername(params)

    return {
        title: channel.displayName,
        description: channel.bio ?? channel.displayName,
        openGraph: {
            images: [
                {
                    url: getMediaSource(channel.avatar),
                    alt: channel.displayName
                }
            ]
        }
    }
}

export default async function ChannelPage(props: {
    params: Promise<{ username: string }>
}) {
    const params = await props.params;
    const { channel, errorCode } = await findChannelByUsername(params);

    // Dacă canalul nu există → 404 (pagina NotFound)
    if (errorCode === "CHANNEL_NOT_FOUND") {
        notFound();
    }

    // Alte erori → log în consola serverului
    if (errorCode) {
        console.error("Channel page error:", errorCode);
        notFound(); // sau redirect către o pagină de eroare dacă vrei
    }

    return <StreamOverview channel={channel} />;
}