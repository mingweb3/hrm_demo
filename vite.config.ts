import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020'
    }
  },
  plugins: [react()],
  esbuild: {
    // https://github.com/vitejs/vite/issues/8644#issuecomment-1159308803
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  resolve: {
    alias: {
      '@/styles': path.resolve(__dirname, './src/styles'),
      '@/constants': path.resolve(__dirname, './src/constants'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/state': path.resolve(__dirname, './src/state'),
      '@/routes': path.resolve(__dirname, './src/routes'),
      '@/app': path.resolve(__dirname, './src/app'),
      '@/assets': path.resolve(__dirname, './src/assets'),
      '@/pages': path.resolve(__dirname, './src/app/pages'),
      '@/locales': path.resolve(__dirname, './src/locales'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/menu-items': path.resolve(__dirname, './src/menu-items'),
      '@/tab-items': path.resolve(__dirname, './src/tab-items'),
      '@/components': path.resolve(__dirname, './src/app/components'),
      '@/public/*': path.resolve(__dirname, './public/*'),
      '@/fake-data': path.resolve(__dirname, './src/fake-data'),
      '@/apis': path.resolve(__dirname, './src/apis'),
      '@/context': path.resolve(__dirname, './src/context')
    }
  }
})
