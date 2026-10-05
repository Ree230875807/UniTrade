import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

let backendPort = 8080;
try {
  const portFile = path.join(process.cwd(), '.backend-port');
  const portStr = fs.readFileSync(portFile, 'utf8');
  backendPort = parseInt(portStr.trim(), 10) || 8080;
} catch (e) {
  // Default to 8080
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: `http://localhost:${backendPort}`,
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
