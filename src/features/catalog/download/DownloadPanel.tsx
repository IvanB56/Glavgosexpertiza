import type { DownloadPanelState } from './useProjectDownload'
import styles from './DownloadPanel.module.css'

interface DownloadPanelProps {
  state: DownloadPanelState
  onCancel: () => void
  onRetry: () => void
}

export function DownloadPanel({ state, onCancel, onRetry }: DownloadPanelProps) {
  if (state.status === 'loading') {
    return (
      <div className={styles.panel}>
        <div className={styles.heading}>
          <label htmlFor="catalog-progress" className={styles.label}>Загрузка реестра</label>
          <span className={styles.percent}>
            {state.percent === null ? 'Размер неизвестен' : `${state.percent}%`}
          </span>
        </div>
        <progress id="catalog-progress" className={styles.progress} max={100} value={state.percent ?? undefined} />
        <button className={`${styles.button} ${styles.secondary}`} type="button" onClick={onCancel}>
          Отменить загрузку
        </button>
      </div>
    )
  }

  return (
    <div className={styles.panel}>
      {state.status === 'error' ? (
        <p className={styles.message} role="alert">
          <strong>Не удалось загрузить реестр.</strong> {state.message}
        </p>
      ) : (
        <p className={styles.message} role="status">Загрузка отменена.</p>
      )}
      <button className={styles.button} type="button" onClick={onRetry}>Загрузить снова</button>
    </div>
  )
}
