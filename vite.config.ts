import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          if (id.includes('@mui') || id.includes('@emotion')) {
            return 'mui'
          }

          if (id.includes('react-router')) {
            return 'router'
          }

          if (id.includes('axios')) {
            return 'network'
          }

          if (id.includes('react')) {
            return 'react'
          }
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
