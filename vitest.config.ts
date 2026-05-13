import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['app/src/**/*.test.ts', 'scripts/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/.git/**'],
    globals: true
  }
})
