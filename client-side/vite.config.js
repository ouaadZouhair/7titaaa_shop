import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    /* Target modern browsers — smaller output, faster parse */
    target: 'es2020',

    /* Warn when a chunk exceeds 600 kB (default 500) */
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        /**
         * Manual chunk splitting:
         *  - vendor      → react + react-dom + react-router (stable, long cache)
         *  - motion      → framer/motion (large but changes rarely)
         *  - i18n        → i18next + react-i18next
         *  - ui-libs     → swiper + lucide-react
         *  Everything else (pages, components) is auto-split by Rollup.
         */
        manualChunks(id) {
          if (id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/react-router')) {
            return 'vendor-react'
          }
          if (id.includes('node_modules/motion') ||
              id.includes('node_modules/framer-motion')) {
            return 'vendor-motion'
          }
          if (id.includes('node_modules/i18next') ||
              id.includes('node_modules/react-i18next')) {
            return 'vendor-i18n'
          }
          if (id.includes('node_modules/swiper') ||
              id.includes('node_modules/lucide-react')) {
            return 'vendor-ui'
          }
          if (id.includes('node_modules/axios') ||
              id.includes('node_modules/react-hook-form')) {
            return 'vendor-utils'
          }
        },
      },
    },
  },

  /* Pre-bundle common deps for fast dev server cold start */
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'motion', 'axios'],
  },
})
