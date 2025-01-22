import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid(),tailwindcss(),solidPlugin()],
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
          if (id.includes('solid-js')) {
            return 'solid-js'
          }
          
          // if (id.includes('bignumber.js')) {
          //   return 'bignumber.js'
          // }
          // if (id.includes('solid-js')) {
          //   return 'solid-js'
          // }
          if (id.includes('@solidjs/router')) {
            return '@solidjs/router'
          }
          if (id.includes('solid-toast')) {
            return 'solid-toast'
          }
  
          if (id.includes('@iconify-icon/solid')) {
            return '@iconify-icon/solid'
          }
          // if (id.includes('solid-js/web')) {
          //   return 'solid-js/web'
          // }
          // if (id.includes('balls.jsx')) {
          //   return 'balls.jsx'
          // }
          // if (id.includes('node-forge')) {
          //   return 'node-forge'
          // }
          if (id.includes('iconify-icon')) {
            return 'iconify-icon'
          }
          // if (id.includes('axios')) {
          //   return 'axios'
          // }
          // if (id.includes('buffer/index.js')) {
          //   return 'buffer/index.js'
          // }
          if (id.includes('arweave-wallet-connector/lib/index.js')) {
            return 'arweave-wallet-connector/lib/index.js'
          }
          // if (id.includes('warp-arbundles/build/web/esm/bundle.js')) {
          //   return 'warp-arbundles/build/web/esm/bundle.js'
          // }
   
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      },
    }
  },
})
