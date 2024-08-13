import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, '**/node_modules/**'],
      // root: fileURLToPath(new URL('./', import.meta.url)),
      setupFiles: './setupTests.js',
      globals: true,
    }
  })
)
