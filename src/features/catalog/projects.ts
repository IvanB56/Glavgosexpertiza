export interface Project {
  readonly id: number
  readonly title: string
  readonly category: string
  readonly city: string
  readonly status: string
}

interface ProjectColumn {
  field: keyof Project
  heading: string
  width?: string
}

export const projectColumns: readonly ProjectColumn[] = [
  { field: 'id', heading: 'ID', width: '11%' },
  { field: 'title', heading: 'Наименование' },
  { field: 'category', heading: 'Категория', width: '19%' },
  { field: 'city', heading: 'Город', width: '14%' },
  { field: 'status', heading: 'Статус', width: '20%' },
]
