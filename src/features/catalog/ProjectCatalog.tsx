import { DownloadPanel } from './download/DownloadPanel'
import { useProjectDownload } from './download/useProjectDownload'
import type { Project } from './projects'
import { SearchInput } from './search/SearchInput'
import { useProjectSearch } from './search/useProjectSearch'
import { ProjectTable } from './table/ProjectTable'
import styles from './ProjectCatalog.module.css'

const numberFormat = new Intl.NumberFormat('ru-RU')

function ProjectResults({ projects }: { projects: readonly Project[] }) {
  const { input, setInput, results, highlight } = useProjectSearch(projects)

  if (projects.length === 0) {
    return <p className={styles.emptyState}>В реестре пока нет проектов.</p>
  }

  return (
    <>
      <div className={styles.toolbar}>
        <SearchInput value={input} onChange={setInput} />
        <p className={styles.resultCount} role="status">
          Записей: <strong>{numberFormat.format(results.length)}</strong> из {numberFormat.format(projects.length)}
        </p>
      </div>
      {results.length > 0 ? (
        <ProjectTable projects={results} highlight={highlight} />
      ) : (
        <p className={styles.emptyState}>Совпадений нет. Попробуйте изменить запрос.</p>
      )}
    </>
  )
}

export function ProjectCatalog() {
  const { state, cancel, retry } = useProjectDownload()

  return (
    <section className={styles.catalog} aria-labelledby="catalog-title">
      <header className={styles.header}>
        <h2 id="catalog-title" className={styles.title}>Список проектов</h2>
        <span className={styles.loadStatus} role="status">
          {state.status === 'success' && 'Загружено · 100%'}
        </span>
      </header>

      {state.status === 'success' ? (
        <ProjectResults projects={state.projects} />
      ) : (
        <DownloadPanel state={state} onCancel={cancel} onRetry={retry} />
      )}
    </section>
  )
}
