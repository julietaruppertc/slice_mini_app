import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: [
      'familiarisingly-unsere-della.ngrok-free.dev', // agrega tu host ngrok aquí
      // opcionalmente puedes permitir todos con 'all':
      // 'all'
    ],
  },
})
