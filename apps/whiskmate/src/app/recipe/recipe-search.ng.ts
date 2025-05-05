import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { rxResource } from '@angular/core/rxjs-interop';
import { RecipeFilterCriteria } from './recipe-filter-criteria';
import { RecipeFilter } from './recipe-filter.ng';
import { RecipeList } from './recipe-list.ng';
import { RecipeAddButton } from './recipe-add-button.ng';
import { Message } from '../shared/message.ng';
import { RecipeRepository } from './recipe-repository';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-recipe-search',
  imports: [
    Message,
    MatButtonModule,
    RecipeFilter,
    RecipeList,
    RecipeAddButton,
  ],
  template: `
    <wm-recipe-filter (filterChange)="filter.set($event)"></wm-recipe-filter>

    @if (recipesResource.isLoading()) {
      <wm-message>⏳ Searching...</wm-message>
    }
    @if (recipesResource.error()) {
      <wm-message>💥 Something went wrong</wm-message>
    }

    @if (recipesResource.value(); as recipes) {
      @if (recipes && recipes.length > 0) {
        <wm-recipe-list [recipes]="recipes">
          <ng-template #actions let-recipe>
            <wm-recipe-add-button [recipe]="recipe" />
          </ng-template>
        </wm-recipe-list>
      } @else {
        <wm-message> 😿 no results</wm-message>
      }
    }
  `,
})
export class RecipeSearch {
  filter = signal<RecipeFilterCriteria>({});
  recipesResource = rxResource({
    params: this.filter,
    stream: ({ params }) => this._recipeRepository.search(params.keywords),
  });

  private _recipeRepository = inject(RecipeRepository);
}

export default RecipeSearch;
