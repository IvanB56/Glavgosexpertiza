import { Fragment } from 'react'
import { projectColumns } from '../projects'
import type { Project } from '../projects'
import type { HighlightText } from '../search/useProjectSearch'
import { ROW_HEIGHT, useVirtualProjectRows } from './useVirtualProjectRows'
import styles from './ProjectTable.module.css'

const HEADER_HEIGHT = 44

interface ProjectTableProps {
  projects: readonly Project[]
  highlight: HighlightText
}

function ProjectTableHeader() {
  return (
    <thead>
      <tr aria-rowindex={1}>
        {projectColumns.map(({ field, heading }) => (
          <th key={field} scope="col" className={styles.headerCell} style={{ height: HEADER_HEIGHT }}>{heading}</th>
        ))}
      </tr>
    </thead>
  )
}

function HighlightedText({ parts }: { parts: ReturnType<HighlightText> }) {
  return parts.map(({ text, matched }, index) =>
    matched ? <mark key={index} className={styles.highlight}>{text}</mark> : <Fragment key={index}>{text}</Fragment>,
  )
}

interface ProjectRowProps {
  project: Project
  rowIndex: number
  highlight: HighlightText
}

function ProjectRow({ project, rowIndex, highlight }: ProjectRowProps) {
  return (
    <tr aria-rowindex={rowIndex} className={styles.row} style={{ height: ROW_HEIGHT }}>
      {projectColumns.map(({ field }) => {
        const text = String(project[field])

        return (
          <td key={field} className={styles.cell} data-field={field} title={text}>
            <span className={styles.cellText}><HighlightedText parts={highlight(text)} /></span>
          </td>
        )
      })}
    </tr>
  )
}

function SpacerRow({ height }: { height: number }) {
  if (height <= 0) return null

  return (
    <tr aria-hidden="true">
      <td colSpan={projectColumns.length} className={styles.spacerCell} style={{ height }} />
    </tr>
  )
}

export function ProjectTable({ projects, highlight }: ProjectTableProps) {
  const { viewport, rows, topSpace, bottomSpace } = useVirtualProjectRows(projects, HEADER_HEIGHT)

  return (
    <div
      ref={viewport}
      className={styles.viewport}
      role="region"
      aria-label="Область прокрутки таблицы проектов"
      tabIndex={0}
    >
      <table className={styles.table} aria-label="Проекты" aria-rowcount={projects.length + 1}>
        <colgroup>
          {projectColumns.map(({ field, width }) => <col key={field} style={{ width }} />)}
        </colgroup>
        <ProjectTableHeader />
        <tbody>
          <SpacerRow height={topSpace} />
          {rows.map(({ index, key }) => (
            <ProjectRow
              key={key}
              project={projects[index]}
              rowIndex={index + 2}
              highlight={highlight}
            />
          ))}
          <SpacerRow height={bottomSpace} />
        </tbody>
      </table>
    </div>
  )
}
