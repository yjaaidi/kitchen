import angular from '@analogjs/vite-plugin-angular';
import { defineConfig } from 'vite';

export default defineConfig({
  root: __dirname,
  cacheDir: './node_modules/.vite/whiskmate',
  plugins: [angular({ jit: false })],
  resolve: {
    tsconfigPaths: true,
  }
});
