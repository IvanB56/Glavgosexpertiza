import { useId } from 'react'
import styles from './SearchInput.module.css'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  const inputId = useId()

  return (
    <div role="search" className={styles.field}>
      <label htmlFor={inputId} className={styles.label}>Поиск по реестру</label>
      <div className={styles.control}>
        <svg className={styles.icon} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" strokeLinecap="round" />
        </svg>
        <input
          id={inputId}
          className={styles.input}
          type="search"
          value={value}
          onChange={(event) => onChange(event.currentTarget.value)}
          placeholder="Например, Казань или ремонт"
        />
      </div>
    </div>
  )
}
