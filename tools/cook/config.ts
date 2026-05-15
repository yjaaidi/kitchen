import { type Config, type Exercise } from './core.ts';

const files = {};

const exercises: Exercise[] = [
  {
    id: '101-component-interaction',
    name: '101 - Component Interaction',
  },
];

export const config: Config = {
  base: 'main',
  exercises,
};
