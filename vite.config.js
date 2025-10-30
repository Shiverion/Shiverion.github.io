import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // This base path '/' is correct for your User Page (shiverion.github.io)
  base: '/',
  plugins: [react()],
})