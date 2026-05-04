import type { Plugin } from 'vite'
import { edoApiMockMiddleware } from './edoApiMockMiddleware'

/** Мок REST для интерактивного Swagger UI (dev и preview). */
export function edoApiMockPlugin(): Plugin {
  return {
    name: 'edo-api-mock',
    configureServer(server) {
      server.middlewares.use(edoApiMockMiddleware())
    },
    configurePreviewServer(server) {
      server.middlewares.use(edoApiMockMiddleware())
    },
  }
}
