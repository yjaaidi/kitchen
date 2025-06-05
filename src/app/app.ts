import { Component } from '@angular/core';
import { RecipeSearch } from './recipe/recipe-search.ng';

@Component({
  selector: 'wm-root',
  template: ` <wm-recipe-search /> `,
  imports: [RecipeSearch],
})
export class App {}
