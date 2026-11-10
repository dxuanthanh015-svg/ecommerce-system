import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // sockjs-client's browser crypto shim still references Node's `global`.
  // Vite does not provide that Node global in browser builds, so map it to
  // the browser-native global object.
  define: {
    global: 'globalThis',
  },
})
