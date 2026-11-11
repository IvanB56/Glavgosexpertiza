import { responseBodyError } from './errors'
import type { ProgressListener } from './types'

function getTotalBytes(response: Response): number | null {
  const encoding = response.headers.get('content-encoding')
  if (encoding && encoding.toLowerCase() !== 'identity') return null

  if (!encoding && response.type === 'cors') return null

  const length = response.headers.get('content-length')
  if (length === null || !/^\d+$/.test(length)) return null

  const size = Number(length)
  return Number.isSafeInteger(size) ? size : null
}

export function readResponseStream(
  response: Response,
  signal: AbortSignal,
  onProgress?: ProgressListener,
): ReadableStream<Uint8Array> | null {
  if (!response.body) return null

  const reader = response.body.getReader()
  const totalBytes = onProgress ? getTotalBytes(response) : null
  let receivedBytes = 0
  let started = false
  let cancelled = false

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        signal.throwIfAborted()
        if (!started) {
          started = true
          onProgress?.({ receivedBytes, totalBytes })
        }
        if (cancelled) return

        const chunk = await reader.read()
        if (cancelled) return
        signal.throwIfAborted()

        if (chunk.done) {
          reader.releaseLock()
          controller.close()
          return
        }

        receivedBytes += chunk.value.byteLength
        onProgress?.({ receivedBytes, totalBytes })
        if (!cancelled) controller.enqueue(chunk.value)
      } catch (error) {
        if (cancelled) return

        const failure = responseBodyError(error, signal)
        controller.error(failure)
        await reader.cancel(failure).catch(() => undefined)
        reader.releaseLock()
      }
    },
    async cancel(reason: unknown) {
      cancelled = true
      try {
        await reader.cancel(reason)
      } catch (error) {
        throw responseBodyError(error, signal)
      } finally {
        reader.releaseLock()
      }
    },
  }, { highWaterMark: 0 })
}
