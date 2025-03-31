import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import tailwindcss from "@tailwindcss/vite";


export default defineConfig({
  plugins: [solid(),tailwindcss()],
  server: {
    allowedHosts :["c7ef-101-207-2-181.ngrok-free.app"]
  }
})
