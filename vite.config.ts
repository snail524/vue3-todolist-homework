import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import UnoCSS from 'unocss/vite'
import path from 'path'

export default defineConfig({
    // base: '/vue3-todolist-homework/',
    // base: './',
    base : process.env.VITE_BASE || './',
    plugins: [
        vue(),
        UnoCSS(),
        electron({
            entry: './src-electron/main.js'
        })
    ],
    server: {
         port: 5173,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
  }
})

