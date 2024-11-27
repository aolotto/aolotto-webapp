import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [solid(),tailwindcss()],
  base:"./",
  build: {
    cssMinify: "esbuild",
    rollupOptions:{
      plugins: [visualizer({ open: false })],
      output: {
        manualChunks: (id) => {
          if (id.includes('aoconnect')) {
            return 'aoconnect'
          }
          if (id.includes('@othent/kms')) {
            return '@othent/kms'
          }
          if (id.includes('bignumber.js')) {
            return 'bignumber.js'
          }
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      },
    }
  },
})
