import type { Project } from '../projects'

export class ProjectDataError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ProjectDataError'
  }
}

function isProject(value: unknown): value is Project {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof value.id === 'number' &&
    Number.isSafeInteger(value.id) &&
    value.id > 0 &&
    'title' in value &&
    typeof value.title === 'string' &&
    'category' in value &&
    typeof value.category === 'string' &&
    'city' in value &&
    typeof value.city === 'string' &&
    'status' in value &&
    typeof value.status === 'string'
  )
}

export function parseProjects(payload: unknown): readonly Project[] {
  if (!Array.isArray(payload)) {
    throw new ProjectDataError('Ожидался массив проектов.')
  }

  const projects: Project[] = []
  const ids = new Set<number>()

  const records: readonly unknown[] = payload

  for (const [index, value] of records.entries()) {
    if (!isProject(value)) {
      throw new ProjectDataError(`Некорректные данные в записи №${index + 1}.`)
    }
    if (ids.has(value.id)) {
      throw new ProjectDataError(`Идентификатор проекта ${value.id} повторяется.`)
    }

    ids.add(value.id)
    projects.push(value)
  }

  return projects
}
