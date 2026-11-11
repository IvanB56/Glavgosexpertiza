import { request, RequestError } from '../../../shared/http'
import type { DownloadProgress } from '../../../shared/http'
import type { Project } from '../projects'
import { parseProjects } from './parseProjects'

function getPercent({ receivedBytes, totalBytes }: DownloadProgress): number | null {
  if (totalBytes === null || totalBytes === 0) return null

  return Math.min(99, Math.floor((receivedBytes / totalBytes) * 100))
}

export async function loadProjects(
  signal: AbortSignal,
  onProgress: (percent: number | null) => void,
): Promise<readonly Project[]> {
  const url = `${import.meta.env.BASE_URL}data/projects.json`
  let previousPercent: number | null | undefined

  const payload = await request(url, {
    responseType: 'json',
    signal,
    cache: 'no-store',
    onProgress(progress) {
      const percent = getPercent(progress)
      if (percent === previousPercent) return

      previousPercent = percent
      onProgress(percent)
    },
  })

  if (signal.aborted) throw new RequestError('aborted', signal.reason)
  return parseProjects(payload)
}
