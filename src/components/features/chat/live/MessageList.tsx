import { FindChatMessagesByStreamQuery, useChatMessageAddedSubscription, useFindChatMessagesByStreamQuery, useFindSponsorsByChannelQuery, type FindChannelByUsernameQuery } from "@/graphql/generated/output";
import { useEffect, useState } from "react";
import { MessageItem } from "./MessageItem";

interface MessageListProps {
    channel: FindChannelByUsernameQuery['findChannelByUsername']
}

export function MessageList({ channel }: MessageListProps) {

    const { data } = useFindChatMessagesByStreamQuery({
        variables: {
            streamId: channel.stream.id
        }
    })

    const { data: sponsorsData } = useFindSponsorsByChannelQuery({
        variables: {
            channelId: channel.id
        }
    })


    const sponsors = sponsorsData.findSponsorsByChannel ?? []
    const sponsorsIds = new Set(sponsors.map(sponsor => sponsor.user.id))

    const [messages, setMessages] = useState<
        FindChatMessagesByStreamQuery['findChatMessagesByStream']
    >([])

    const { data: newMessageData } = useChatMessageAddedSubscription({
        variables: {
            streamId: channel.stream.id
        }
    })




    useEffect(() => {
        if (data && data.findChatMessagesByStream) {
            setMessages(data.findChatMessagesByStream)
        }
    }, [data])

    useEffect(() => {
        if (newMessageData) {
            const newMessage = newMessageData.chatMessageAdded
            setMessages(prev => [newMessage, ...prev])
        }
    }, [newMessageData])


    return <div className='flex h-full flex-1 flex-col-reverse overscroll-y-auto'>
        {messages.map((message, index) => (
            <MessageItem key={index} message={message} isSponsor={sponsorsIds.has(message.user.id)} />
        ))}
    </div>
}