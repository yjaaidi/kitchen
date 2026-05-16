import { type Config, type Exercise } from './core.ts';

const files = {};

const exercises: Exercise[] = [
  {
    id: '101-component-testing',
    name: '101 - Component Testing',
  },
  {
    id: '102-props-and-callbacks',
    name: '102 - Props and Callbacks',
  },
  {
    id: '201-test-doubles',
    name: '201 - Test Doubles',
  },
  {
    id: '202-contract-testing',
    name: '202 - Contract Testing',
  },
];

export const config: Config = {
  base: 'main',
  exercises,
};
