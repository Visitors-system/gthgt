import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: parseInt(process.env.FRONTEND_PORT) || 3000,
    strictPort: true, // Vite will exit if the port is already in use
    host: true // Listen on all addresses, including LAN and public addresses
  },
  root: 'src/frontend', // Set the root to the frontend directory
  build: {
    outDir: '../../dist/frontend', // Output directory relative to the project root
    emptyOutDir: true,
  }
})
