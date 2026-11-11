import { writeFileSync } from 'node:fs'

const projectTypes = [
  ['Реконструкция школы', 'Образование'],
  ['Строительство поликлиники', 'Здравоохранение'],
  ['Капитальный ремонт моста', 'Транспорт'],
  ['Модернизация теплосети', 'Инфраструктура'],
  ['Строительство детского сада', 'Образование'],
  ['Реконструкция стадиона', 'Спорт'],
  ['Обустройство набережной', 'Благоустройство'],
  ['Ремонт автомобильной дороги', 'Транспорт'],
]

const cities = ['Москва', 'Казань', 'Пермь', 'Тула', 'Самара', 'Уфа', 'Омск', 'Сочи', 'Тверь']
const statuses = ['На рассмотрении', 'Согласован', 'На доработке']

const records = Array.from({ length: 2_000 }, (_, index) => {
  const [title, category] = projectTypes[index % projectTypes.length]
  const id = index + 1

  return {
    id,
    title: `${title} №${id}`,
    category,
    city: cities[index % cities.length],
    status: statuses[Math.floor(index / projectTypes.length) % statuses.length],
  }
})

const json = records.map((record) => `  ${JSON.stringify(record)}`).join(',\n')
try {
  writeFileSync(new URL('../public/data/projects.json', import.meta.url), `[\n${json}\n]\n`)
} catch (error) {
  throw new Error('Не удалось записать файл реестра проектов «public/data/projects.json».', { cause: error })
}
