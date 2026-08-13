import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/chitamaru-trip-route-stay/',
  plugins: [react()],
})
