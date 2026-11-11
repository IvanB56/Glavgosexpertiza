import type { QueryParams } from './types'

interface RequestParameters extends RequestInit {
  query?: QueryParams
  json?: unknown
}

function serializeQuery(query: QueryParams): string {
  if (query instanceof URLSearchParams) return query.toString()

  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value == null) continue

    if (typeof value !== 'object') {
      params.append(key, String(value))
      continue
    }

    for (const item of value) {
      if (item != null) params.append(key, String(item))
    }
  }
  return params.toString()
}

function withQuery(input: string | URL, query?: QueryParams): string {
  const url = String(input)
  if (!query) return url

  const params = serializeQuery(query)
  if (!params) return url

  const fragmentIndex = url.indexOf('#')
  const path = fragmentIndex < 0 ? url : url.slice(0, fragmentIndex)
  const fragment = fragmentIndex < 0 ? '' : url.slice(fragmentIndex)
  const separator = path.includes('?')
    ? (path.endsWith('?') || path.endsWith('&') ? '' : '&')
    : '?'

  return `${path}${separator}${params}${fragment}`
}

export function createRequest(input: string | URL, { query, json, ...init }: RequestParameters): Request {
  const url = withQuery(input, query)
  if (json === undefined) return new Request(url, init)

  if (init.body !== undefined) throw new TypeError('Укажите только один параметр для тела запроса: body или json.')

  const body = JSON.stringify(json)
  if (body === undefined) throw new TypeError('Не удалось преобразовать тело запроса в JSON.')

  const headers = new Headers(init.headers)
  if (!headers.has('content-type')) headers.set('content-type', 'application/json')

  return new Request(url, { ...init, headers, body })
}
