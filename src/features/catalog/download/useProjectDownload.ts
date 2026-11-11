import { useEffect, useRef, useState } from 'react'
import type { Project } from '../projects'
import { loadProjects } from './loadProjects'
import { getProjectDownloadErrorMessage } from './projectDownloadError'

export type DownloadPanelState =
  | { status: 'loading'; percent: number | null }
  | { status: 'cancelled' }
  | { status: 'error'; message: string }

type DownloadState = DownloadPanelState | { status: 'success'; projects: readonly Project[] }

const loadingState: DownloadState = { status: 'loading', percent: 0 }

export function useProjectDownload() {
  const [state, setState] = useState<DownloadState>(loadingState)
  const [attempt, setAttempt] = useState(0)
  const activeRequest = useRef<AbortController | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    activeRequest.current = controller

    async function download() {
      try {
        const projects = await loadProjects(signal, (percent) => {
          if (!signal.aborted) setState({ status: 'loading', percent })
        })
        if (!signal.aborted) setState({ status: 'success', projects })
      } catch (error) {
        if (signal.aborted) return

        setState({ status: 'error', message: getProjectDownloadErrorMessage(error) })
      } finally {
        if (activeRequest.current === controller) activeRequest.current = null
      }
    }

    void download()

    return () => controller.abort()
  }, [attempt])

  function cancel() {
    if (activeRequest.current === null) return

    activeRequest.current.abort()
    activeRequest.current = null
    setState({ status: 'cancelled' })
  }

  function retry() {
    setState(loadingState)
    setAttempt((current) => current + 1)
  }

  return { state, cancel, retry }
}
