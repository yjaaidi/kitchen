import { type Config, type Exercise } from './core.ts';

const exercises: Exercise[] = [
  {
    id: '101-display-recipes',
    name: '101. Display Recipes',
  },
  {
    id: '102-filter-recipes',
    name: '102. Filter Recipes',
  },
  {
    id: '201-recipe-preview',
    name: '201. Recipe Preview',
  },
  {
    id: '202-recipe-filter',
    name: '202. Recipe Filter',
  },
  {
    id: '203-recipe-filter-two-way-binding',
    name: '203. Recipe Filter Two-Way Binding',
  },
  {
    id: '301-recipe-preview-customization',
    name: '301. Recipe Preview Customization',
  },
  {
    id: '302-theming',
    name: '302. Theming',
  },
  {
    id: '303-slots',
    name: '303. Slots',
  },
  {
    id: '401-fetch-recipes',
    name: '401. Fetch Recipes',
  },
  {
    id: '402-handle-errors',
    name: '402. Handle Errors',
  },
  {
    id: '403-cancel-request',
    name: '403. Cancel Request',
  },
  {
    id: '404-task',
    name: '404. Task',
  },
  {
    id: '501-meal-plan',
    name: '501. Meal Plan',
  },
  {
    id: '502-signals',
    name: '502. Signals',
  },
  {
    id: '601-context',
    name: '601. Context',
  },
  {
    id: '602-singleton',
    name: '602. Singleton',
  },
];

export const config: Config = {
  base: 'main',
  exercises,
};
