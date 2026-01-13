import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    allowedHosts: ['63d171f60b6b.ngrok-free.app'],
    proxy: {
      '/api/tripay': {
        target: 'https://tripay.co.id',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/tripay/, '/api-sandbox'),
        secure: true
      }
    }
  }
})
