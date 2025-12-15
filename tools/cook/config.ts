import { type Config, type Exercise } from './core.ts';

const exercises: Exercise[] = [
  {
    id: '101-display-recipes',
    name: 'Display Recipes',
  },
  {
    id: '102-filter-recipes',
    name: 'Filter Recipes',
  },
  {
    id: '201-recipe-preview',
    name: 'Recipe Preview',
  },
  {
    id: '202-recipe-filter',
    name: 'Recipe Filter',
  },
  {
    id: '203-recipe-filter-two-way-binding',
    name: 'Recipe Filter Two-Way Binding',
  },
  {
    id: '301-recipe-preview-customization',
    name: 'Recipe Preview Customization',
  },
  {
    id: '302-theming',
    name: 'Theming',
  },
  {
    id: '401-fetch-recipes',
    name: 'Fetch Recipes',
  },
  {
    id: '402-handle-errors',
    name: 'Handle Errors',
  },
  {
    id: '403-cancel-request',
    name: 'Cancel Request',
  },
  {
    id: '404-task',
    name: 'Task',
  },
];

export const config: Config = {
  base: 'main',
  exercises,
};
