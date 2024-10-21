import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/maps-burro-sm',
  plugins: [react()],
  server: {
    host: true
  }
})
