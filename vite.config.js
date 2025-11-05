import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Para desarrollo local con XAMPP, usar base: '/'
  // Para GitHub Pages, cambiar a: base: '/FitTrack/'
  base: '/',
})
