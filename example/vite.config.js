import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default ({ mode }) => {
  return defineConfig({
    server: {
      host: '0.0.0.0',
      port: 3001,
      disableHostCheck: true,
      open: '/index.html'
    },
    root: 'src',
    resolve: {
      alias: {
        '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src')
      }
    }
  })
}
