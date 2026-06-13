import { Component } from '@angular/core';
import { MealPlan } from './meal-plan.ng';
import { RecipeSearch } from './recipe-search.ng';

@Component({
  selector: 'app-whiskmate',
  imports: [MealPlan, RecipeSearch],
  template: `
    <div class="layout">
      <app-recipe-search />
      <app-meal-plan />
    </div>
  `,
  styles: `
    .layout {
      display: flex;
      min-height: 100vh;
    }

    .layout > * {
      display: block;
      flex: 1;
      min-width: 0;
    }

    .layout > * + * {
      border-left: 1px solid #ddd;
    }
  `,
})
export default class Whiskmate {}
