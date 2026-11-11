export class HttpError extends Error {
  readonly status: number
  readonly headers: Headers

  constructor(response: Response) {
    super(`Сервер вернул HTTP ${response.status}.`)
    this.name = 'HttpError'
    this.status = response.status
    this.headers = response.headers
  }
}

export type RequestErrorKind = 'request' | 'network' | 'aborted' | 'body' | 'empty-body' | 'decode'

const messages: Record<RequestErrorKind, string> = {
  request: 'Не удалось подготовить HTTP-запрос.',
  network: 'Не удалось связаться с сервером.',
  aborted: 'Запрос отменён.',
  body: 'Не удалось прочитать тело ответа.',
  'empty-body': 'Сервер вернул ответ без тела.',
  decode: 'Не удалось разобрать ответ как JSON.',
}

export class RequestError extends Error {
  readonly kind: RequestErrorKind

  constructor(kind: RequestErrorKind, cause?: unknown) {
    super(messages[kind], { cause })
    this.name = 'RequestError'
    this.kind = kind
  }
}

export function responseBodyError(error: unknown, signal: AbortSignal): RequestError {
  if (error instanceof RequestError) return error

  return signal.aborted
    ? new RequestError('aborted', signal.reason)
    : new RequestError('body', error)
}
