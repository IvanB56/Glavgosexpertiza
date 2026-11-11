import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { demoCatalog } from './server/demoCatalog.ts'

export default defineConfig({
  plugins: [react(), demoCatalog()],
})
