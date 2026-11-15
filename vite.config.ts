import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { compression } from 'vite-plugin-compression2'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    // 预生成 .gz / .br，配合 Nginx 的 gzip_static / brotli_static 静态压缩
    compression({ algorithm: 'gzip', threshold: 10240 }),
    compression({ algorithm: 'brotli', threshold: 10240 }),
  ],
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
    },
  },
  optimizeDeps: {
    exclude: ['@arcgis/core', '@arcgis/core/assets'],
  },
  build: {
    target: 'esnext',
    sourcemap: false,
    outDir: 'dist',
    rollupOptions: {
      output: {
        // 按模块路径拆分 ArcGIS SDK，避免单个超大 chunk；
        // 2D 页面不会下载 3D 专属模块（views/SceneView 等）
        manualChunks(id) {
          if (id.includes('@arcgis/core')) {
            if (id.includes('/views/')) return 'arcgis-views'
            if (id.match(/\/(layers|symbols|geometry)\//) || id.match(/\/Graphic\.js$/)) return 'arcgis-layers'
            return 'arcgis-core'
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
  server: {
    host: true,
    port: 5173,
  },
})
