import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Title } from './shared/title.ng';
import { RecipeSearch } from './recipe/recipe-search.ng';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-app',
  imports: [Title, RecipeSearch],
  template: ` <wm-title>👨🏻‍🍳 Welcome to Whiskmate 🥘</wm-title>
    <wm-recipe-search />`,
})
export class App {}
