import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/chitamaru-comicstay/',
  plugins: [react()],
})
