import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin, swcPlugin } from 'electron-vite'
import { visualizer } from 'rollup-plugin-visualizer'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin(), swcPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react(), visualizer(), externalizeDepsPlugin()],
    server: {
      host: '0.0.0.0'
    },
    build: {
      rollupOptions: {
        external: [
          'babylonjs',
          'babylonjs-loaders',
          'babylonjs/serializers',
          'babylonjs/gui-editor',
          'babylonjs/gui',
          'babylonjs/materials',
          'babylonjs/inspector'
        ],
        output: {
          paths: {
            'babylonjs-loaders': 'https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js',
            'babylonjs-inspector': 'https://cdn.babylonjs.com/inspector/babylon.inspector.bundle.js',
            babylonjs: 'https://cdn.babylonjs.com/babylon.js'
          }
        }
      }
    }
  }
})
