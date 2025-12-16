import { InMemoryCache, ApolloClient, HttpLink, split } from "@apollo/client";
import { createUploadLink } from 'apollo-upload-client';
import { SERVER_URL, WEBSOKET_URL } from "./constants/url.constants";
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from "@apollo/client/utilities";

const httpLink = createUploadLink({
    uri: SERVER_URL,
    credentials: "include",
    headers: {
        'apollo-require-preflight': 'true',
    },
});

const wsLink = new WebSocketLink({
    uri: WEBSOKET_URL,
    options: {
        reconnect: true
    }
})

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,   // subscription
    httpLink  // query/mutation (upload inclus)
);

export const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache()
})