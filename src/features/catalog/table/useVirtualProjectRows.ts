import { useCallback, useLayoutEffect, useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { Project } from '../projects'

export const ROW_HEIGHT = 52

export function useVirtualProjectRows(projects: readonly Project[], headerHeight: number) {
  const viewport = useRef<HTMLDivElement>(null)
  const getItemKey = useCallback((index: number) => projects[index].id, [projects])
  const virtualizer = useVirtualizer({
    count: projects.length,
    getScrollElement: () => viewport.current,
    getItemKey,
    estimateSize: () => ROW_HEIGHT,
    scrollMargin: headerHeight,
    overscan: 6,
  })

  useLayoutEffect(() => {
    if (viewport.current) viewport.current.scrollTop = 0
  }, [projects])

  const rows = virtualizer.getVirtualItems()
  const firstRow = rows[0]
  const lastRow = rows.at(-1)
  const topSpace = firstRow ? firstRow.start - headerHeight : 0
  const renderedEnd = lastRow ? lastRow.end - headerHeight : 0
  const bottomSpace = virtualizer.getTotalSize() - renderedEnd

  return { viewport, rows, topSpace, bottomSpace }
}
