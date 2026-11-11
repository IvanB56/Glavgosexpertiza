import { RequestError, responseBodyError } from './errors'
import { readResponseStream } from './responseStream'
import type { ProgressListener, ResponseData, ResponseFormat } from './types'

type ResponseReader<Format extends ResponseFormat> = (
  response: Response,
  signal: AbortSignal,
  onProgress?: ProgressListener,
) => ResponseData[Format] | Promise<ResponseData[Format]>

function decodeJson(bytes: ArrayBuffer): unknown {
  try {
    const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes)
    return JSON.parse(text)
  } catch (error) {
    throw new RequestError('decode', error)
  }
}

async function readJson(response: Response): Promise<unknown> {
  if (!response.body) throw new RequestError('empty-body')

  return decodeJson(await response.arrayBuffer())
}

export async function discardResponseBody(response: Response): Promise<void> {
  await response.body?.cancel().catch(() => undefined)
}

const readers: { [Format in ResponseFormat]: ResponseReader<Format> } = {
  json: readJson,
  text: (response) => response.text(),
  blob: (response) => response.blob(),
  arrayBuffer: (response) => response.arrayBuffer(),
  stream: readResponseStream,
  void: discardResponseBody,
  raw: (response) => response,
}

export function validateResponseOptions(format: unknown, onProgress?: unknown): void {
  if (typeof format !== 'string' || !Object.hasOwn(readers, format)) {
    throw new TypeError('Укажите поддерживаемый формат ответа в responseType.')
  }
  if (onProgress === undefined) return

  if (typeof onProgress !== 'function') throw new TypeError('В onProgress нужно передать функцию.')
  if (format === 'raw' || format === 'void') {
    throw new TypeError(`Параметр onProgress недоступен для формата ответа «${format}».`)
  }
}

export async function readResponse<Format extends ResponseFormat>(
  response: Response,
  format: Format,
  signal: AbortSignal,
  onProgress?: ProgressListener,
): Promise<ResponseData[Format]> {
  try {
    const source = format !== 'stream' && response.body && onProgress
      ? new Response(readResponseStream(response, signal, onProgress), { headers: response.headers })
      : response

    return await readers[format](source, signal, onProgress)
  } catch (error) {
    throw responseBodyError(error, signal)
  }
}
