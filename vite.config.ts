import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import nightwatchPlugin from 'vite-plugin-nightwatch'
import viteCompression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    nightwatchPlugin(),
    viteCompression({
      verbose: true,      // 在控制台顯示壓縮結果
      disable: false,     // 啟用壓縮
      threshold: 10240,   // 超過 10kB 的檔案才壓縮 (太小的檔案壓縮沒意義)
      algorithm: 'gzip',  // 使用 Gzip 演算法
      ext: '.gz',         // 產生的副檔名
      deleteOriginFile: false // 是否刪除原始檔案？建議設為 false，方便你在電腦上測試
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
