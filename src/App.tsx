import { ProjectCatalog } from './features/catalog/ProjectCatalog'
import styles from './App.module.css'

export default function App() {
  return (
    <>
      <header className={styles.siteHeader}>
        <div className={`${styles.pageWidth} ${styles.siteBrand}`}>
          <span className={styles.brandIcon} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="4.5" y="5.5" width="15" height="13" rx="2" />
              <path d="M4.5 10h15M10 10v8.5M10 14.5h9.5" />
            </svg>
          </span>
          Главгосэкспертиза
        </div>
      </header>
      <main className={`${styles.pageWidth} ${styles.main}`}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>Демонстрационный реестр</p>
          <h1 className={styles.title}>Реестр проектов</h1>
          <p className={styles.description}>Поиск по данным о строительстве, ремонте и реконструкции объектов.</p>
        </div>
        <ProjectCatalog />
      </main>
    </>
  )
}
