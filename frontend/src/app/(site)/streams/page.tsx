import { StreamsContent } from "@/components/features/stream/list/StreamsContent";
import { FindAllStreamsDocument, type FindAllStreamsQuery } from "@/graphql/generated/output";
import { SERVER_URL } from "@/libs/constants/url.constants";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";


async function findAllStreams() {
    try {
        const query = FindAllStreamsDocument.loc?.source.body
        const variables = {
            filters: {}
        }

        const response = await fetch(SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query, variables }),
            next: {
                revalidate: 30
            }
        })

        const data = await response.json()
        return {
            streams: data.data.findAllStreams as FindAllStreamsQuery['findAllStreams']
        }
    } catch (error) {
        console.log(error)
        throw new Error('Error receiving streams')
    }
}

export async function generateMetadata(props: {
    searchParams: Promise<{ searchTerm: string }>
}): Promise<Metadata> {
    const translation = await getTranslations('streams')

    const searchParams = await props.searchParams
    return {
        title: searchParams.searchTerm
            ? `${translation('searchHeading')} "${searchParams.searchTerm}"`
            : translation('heading')
    }
}


export default async function StreamsPage() {
    const { streams } = await findAllStreams()

    return <div className='space-y-10 w-full'>
        <StreamsContent streams={streams} />
    </div>
}
