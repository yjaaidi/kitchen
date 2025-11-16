import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/demo',
  plugins: [angular({ tsconfig: './tsconfig.vitest.json' })],
});
