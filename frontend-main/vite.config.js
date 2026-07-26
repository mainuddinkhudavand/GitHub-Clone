import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@primer/react/drafts': path.resolve(__dirname, 'node_modules/@primer/react/lib-esm/drafts/index.js'),
    },
  },
  optimizeDeps: {
    include: ['@primer/react', '@primer/react/drafts'],
  },
  server: {
    port: 5000,
    strictPort: true,
  },
})
