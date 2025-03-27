import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import tailwindcss from "@tailwindcss/vite";
import solidPlugin from "vite-plugin-solid";


export default defineConfig({
  plugins: [solid(),tailwindcss(), solidPlugin()],
})
