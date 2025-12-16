import type { ApolloError } from '@apollo/client'
import type { ServerError } from '@apollo/client/link/utils'

type Dict = Record<string, unknown>

function isObj(v: unknown): v is Dict {
    return typeof v === 'object' && v !== null
}

function pickString(obj: unknown, path: readonly string[]): string {
    let cur: unknown = obj
    for (const key of path) {
        if (!isObj(cur)) return ''
        cur = cur[key]
    }
    return typeof cur === 'string' ? cur : ''
}

type GraphQLLikeError = {
    message?: unknown
    extensions?: Dict
}

function isServerError(v: unknown): v is ServerError & { bodyText?: unknown } {
    return isObj(v) && 'statusCode' in v
}

function tryParseFirstGraphQLError(bodyText: unknown): GraphQLLikeError | null {
    if (typeof bodyText !== 'string' || bodyText.trim() === '') return null
    try {
        const parsed = JSON.parse(bodyText) as unknown
        if (isObj(parsed) && Array.isArray((parsed as { errors?: unknown }).errors)) {
            const first = (parsed as { errors: unknown[] }).errors[0]
            return isObj(first) ? (first as GraphQLLikeError) : null
        }
    } catch {
        // bodyText nu e JSON valid (HTML/plain text)
    }
    return null
}

function getCodes(ext: unknown) {
    const code = (
        pickString(ext, ['code']) ||
        pickString(ext, ['exception', 'code'])
    ).toUpperCase()

    const status = (
        pickString(ext, ['http', 'status']) ||
        pickString(ext, ['status'])
    ).toUpperCase()

    return { code, status }
}

export function parseApolloMessage(err: unknown): {
    code: string
    status: string
    message: string
} {
    const apolloErr = err as ApolloError | undefined

    const gErr = apolloErr?.graphQLErrors?.[0]
    if (gErr) {
        const { code, status } = getCodes(gErr.extensions as unknown)
        const message =
            typeof gErr.message === 'string' && gErr.message.trim()
                ? gErr.message.trim()
                : 'Something went wrong.'
        return { code, status, message }
    }

    const net = apolloErr?.networkError
    if (isServerError(net)) {
        const first = tryParseFirstGraphQLError((net as { bodyText?: unknown }).bodyText)
        if (first) {
            const { code, status } = getCodes(first.extensions)
            const message =
                typeof first.message === 'string' && first.message.trim()
                    ? first.message.trim()
                    : 'Something went wrong.'
            return { code, status, message }
        }
    }

    return { code: '', status: '', message: 'Something went wrong.' }
}


// onError(err) {
//     toast.error(translation(`error.${parseApolloMessage(err).code}`, {param: 'pula'}))
// }

// "error": {
//     "TOKEN_IS_NOT_ASSOCIADET": "Token is not associated with any user. {param}"
// }