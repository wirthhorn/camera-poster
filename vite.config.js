import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig, loadEnv } from 'vite'

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  return defineConfig({
    css: {
      modules: {
        generateScopedName: '[hash:base64:5]'
      }
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      disableHostCheck: true,
      open: '/index.html'
    },
    root: 'src',
    resolve: {
      alias: {
        '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src')
      }
    },
    build: {
      target: 'esnext',
      // minify: false,
      lib: {
        entry: path.resolve(__dirname, 'src/index.js'),
        name: 'MyLib',
        fileName: (format) => `camera.${format}.js`
      }
    }
  })
}
