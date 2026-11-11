import { HttpError, RequestError } from '../../../shared/http'
import type { RequestErrorKind } from '../../../shared/http'
import { ProjectDataError } from './parseProjects'

const messages: Record<RequestErrorKind, string> = {
  request: 'Не удалось подготовить запрос.',
  network: 'Проверьте подключение к серверу и повторите загрузку.',
  aborted: 'Загрузка отменена.',
  body: 'Не удалось прочитать ответ сервера.',
  'empty-body': 'Сервер вернул ответ без данных.',
  decode: 'Сервер вернул некорректный JSON.',
}

export function getProjectDownloadErrorMessage(error: unknown): string {
  if (error instanceof HttpError || error instanceof ProjectDataError) return error.message
  if (error instanceof RequestError) return messages[error.kind]

  return 'Не удалось получить данные.'
}
