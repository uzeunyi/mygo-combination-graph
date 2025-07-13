import { defineConfig } from 'vite'

export default defineConfig({
  base: '/mygo-combination-graph/',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist'
  }
})
