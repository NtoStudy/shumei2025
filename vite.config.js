import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      manifest: {
        name: '向阳而生 - 大学生心理健康陪伴平台',
        short_name: '向阳而生',
        description: '温暖、不说教、不尴尬的心理健康自助与互助平台',
        theme_color: '#FFB6C1',
        background_color: '#FFF8DC',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
 
  resolve: {
    alias: {
      '@': '/src'
    }
  },

  // 开发服务器配置
  server: {
    proxy: {
      // 代理 Kimi API 请求
      '/api/kimi': {
        target: 'https://api.moonshot.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/kimi/, ''),
        headers: {
          'Origin': 'https://api.moonshot.cn'
        }
      }
    }
  }
})
