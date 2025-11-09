import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ⚙️ Importante: cambia "mavg-catalog" por el nombre exacto de tu repositorio
export default defineConfig({
  base: '/mavg-catalog/',
  plugins: [react()],
})
