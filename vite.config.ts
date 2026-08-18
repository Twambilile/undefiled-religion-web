import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// BASE_PATH lets the same build serve from a GitHub Pages subpath
// (/undefiled-religion-web/) or from the root of a real domain.
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
})
