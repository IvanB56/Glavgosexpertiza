import { HttpError, RequestError } from './errors'
import { discardResponseBody, readResponse, validateResponseOptions } from './readResponse'
import { createRequest } from './requestInit'
import type { RequestOptions, ResponseData, ResponseFormat } from './types'

async function sendRequest(request: Request): Promise<Response> {
  try {
    return await fetch(request)
  } catch (error) {
    throw request.signal.aborted
      ? new RequestError('aborted', request.signal.reason)
      : new RequestError('network', error)
  }
}

export async function request<Format extends ResponseFormat>(
  input: string | URL,
  options: RequestOptions<Format>,
): Promise<ResponseData[Format]> {
  if (!options || typeof options !== 'object') {
    throw new RequestError('request', new TypeError('Передайте параметры запроса с полем responseType.'))
  }
  const { responseType, onProgress, ...parameters } = options

  let prepared: Request
  try {
    validateResponseOptions(responseType, onProgress)
    prepared = createRequest(input, parameters)
  } catch (error) {
    throw new RequestError('request', error)
  }

  const response = await sendRequest(prepared)
  if (responseType !== 'raw' && !response.ok) {
    await discardResponseBody(response)
    throw new HttpError(response)
  }

  return readResponse(response, responseType, prepared.signal, onProgress)
}
