import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pipeline } from 'node:stream/promises'
import { setTimeout as wait } from 'node:timers/promises'
import type { Plugin } from 'vite'

const FILE_PATH = 'data/projects.json'
const CHUNK_COUNT = 24
const CHUNK_INTERVAL_MS = 100

function readCatalogFile(publicDir: string): Buffer {
  try {
    return readFileSync(resolve(publicDir, FILE_PATH))
  } catch (error) {
    throw new Error(`Не удалось прочитать файл реестра проектов «${FILE_PATH}».`, { cause: error })
  }
}

async function* streamChunks(file: Buffer, signal: AbortSignal) {
  const chunkSize = Math.ceil(file.byteLength / CHUNK_COUNT)

  for (let offset = 0; offset < file.byteLength; offset += chunkSize) {
    await wait(CHUNK_INTERVAL_MS, undefined, { signal })
    yield file.subarray(offset, offset + chunkSize)
  }
}

export function demoCatalog(): Plugin {
  return {
    name: 'demo-catalog',
    apply: 'serve',
    configureServer(server) {
      const file = readCatalogFile(server.config.publicDir)
      const path = `${server.config.base}${FILE_PATH}`

      server.middlewares.use((request, response, next) => {
        if (request.url?.split('?', 1)[0] !== path || request.method !== 'GET') {
          next()
          return
        }

        response.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': file.byteLength,
          'Cache-Control': 'no-store, no-transform',
        })
        response.flushHeaders()

        const controller = new AbortController()
        response.once('close', () => controller.abort())

        void pipeline(streamChunks(file, controller.signal), response).catch((error: unknown) => {
          if (controller.signal.aborted) return

          server.config.logger.error('Не удалось передать файл реестра проектов.', {
            error: error instanceof Error ? error : undefined,
          })
        })
      })
    },
  }
}
