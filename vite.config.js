import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
server: {
  proxy: {
    '/api/bestsellers': {
      target: 'http://localhost:3001',
      changeOrigin: true,
    },
    '/api': {
//      target: 'http://localhost:8080',
      target: 'http://54.177.72.135:8080',
      changeOrigin: true,
      //rewrite: (path) => path.replace(/^\/api/, '')
    },
  }
}
})