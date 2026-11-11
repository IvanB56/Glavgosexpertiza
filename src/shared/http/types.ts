export type ResponseData = {
  json: unknown
  text: string
  blob: Blob
  arrayBuffer: ArrayBuffer
  stream: ReadableStream<Uint8Array> | null
  void: void
  raw: Response
}

export type ResponseFormat = keyof ResponseData

export interface DownloadProgress {
  readonly receivedBytes: number
  readonly totalBytes: number | null
}

export type ProgressListener = (progress: DownloadProgress) => void

export type QueryValue = string | number | boolean | null | undefined
export type QueryParams = URLSearchParams | Readonly<Record<string, QueryValue | readonly QueryValue[]>>

export interface RequestOptions<Format extends ResponseFormat = ResponseFormat> extends RequestInit {
  responseType: Format
  onProgress?: ProgressListener
  query?: QueryParams
  json?: unknown
}
