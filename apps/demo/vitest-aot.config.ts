import angular from '@analogjs/vite-plugin-angular';
import { mergeConfig } from 'vitest/config';
import vitestConfig from './vitest.config';

export default mergeConfig(vitestConfig, {
  plugins: [
    angular({
      jit: false,
      tsconfig: './tsconfig.vitest.json',
    }),
  ],
});
