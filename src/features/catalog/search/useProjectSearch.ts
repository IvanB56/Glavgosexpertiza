import { useMemo, useState } from 'react'
import { useDebouncedValue } from '../../../shared/hooks/useDebouncedValue'
import { projectColumns } from '../projects'
import type { Project } from '../projects'

const SEARCH_DELAY_MS = 300

export type HighlightText = (text: string) => { text: string; matched: boolean }[]

function searchProjects(projects: readonly Project[], query: string) {
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = query ? new RegExp(`(${escapedQuery})`, 'iu') : null

  const results = pattern
    ? projects.filter((project) =>
        projectColumns.some(({ field }) => pattern.test(String(project[field]))),
      )
    : projects

  const highlight: HighlightText = (text) => {
    const parts = pattern ? text.split(pattern) : [text]
    return parts.map((part, index) => ({ text: part, matched: index % 2 === 1 }))
  }

  return { results, highlight }
}

export function useProjectSearch(projects: readonly Project[]) {
  const [input, setInput] = useState('')
  const query = useDebouncedValue(input.trim(), SEARCH_DELAY_MS)

  const { results, highlight } = useMemo(() => searchProjects(projects, query), [projects, query])

  return { input, setInput, results, highlight }
}
