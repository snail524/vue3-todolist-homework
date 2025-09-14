import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import UnoCSS from 'unocss/vite'
import path from 'path'


export default defineConfig({
    plugins: [
        vue(),
        UnoCSS(),
        electron({
            // 主进程入口文件
            entry: './src-electron/main.js'
        })
    ],
    /*开发服务器选项*/
    server: {
        // 端口
        port: 3000,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
  }
})
