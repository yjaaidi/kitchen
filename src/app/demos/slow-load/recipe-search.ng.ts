import {
  ChangeDetectionStrategy,
  Component,
  inject,
  linkedSignal,
  ResourceSnapshot,
  resource,
} from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { RecipeAddButton } from '../../meal-planner/recipe-add-button.ng';
import { RecipeRepository } from '../../recipe/recipe-repository';
import { Recipe } from '../../recipe/recipe';
import { Catalog } from '../../shared/catalog.ng';
import { CookGame } from './cook-game.ng';
import { RecipePreview } from './recipe-preview.ng';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-recipe-search',
  imports: [Catalog, CookGame, RecipeAddButton, RecipePreview],
  template: `
    <section class="recipes" aria-labelledby="recipes-heading">
      <h2 id="recipes-heading">Recipes</h2>

      <app-catalog class="catalog">
        @if (recipesResource.isLoading()) {
          <div role="status">Loading recipes...</div>
        }
        @for (recipe of recipes(); track recipe.id) {
          <app-recipe-preview [recipe]="recipe">
            <app-recipe-add-button [recipe]="recipe" />
          </app-recipe-preview>
        }
      </app-catalog>
    </section>

    <section class="kitchen" aria-labelledby="kitchen-heading">
      <h2 id="kitchen-heading">Kitchen</h2>
      <p class="kitchen-hint">
        Grab the knife to chop vegetables, then cook them on the pan or in the oven.
      </p>
      <app-cook-game />
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    h2 {
      text-align: center;
      margin: 1.5rem 0 0.5rem;
      font-size: 1.25rem;
    }

    .catalog {
      min-height: 100vh;
    }

    .kitchen {
      border-top: 1px solid #ddd;
      padding-bottom: 2rem;
    }

    .kitchen-hint {
      text-align: center;
      color: #666;
      font-size: 0.875rem;
      margin: 0 1rem 1rem;
    }

    .kitchen-loading {
      text-align: center;
      color: #666;
      background-color: #f5f0e8;
      height: 420px;
      font-size: 0.875rem;
      margin: 0 1rem 1rem;
    }
  `,
})
export default class SlowLoadDemo {
  protected readonly recipesResource = resource({
    defaultValue: [],
    loader: () => firstValueFrom(this._repo.search()),
  });

  protected readonly recipes = linkedSignal<ResourceSnapshot<Recipe[]>, Recipe[]>({
    source: () => this.recipesResource.snapshot(),
    computation: (snapshot, prev) =>
      snapshot.status === 'resolved' ? snapshot.value : (prev?.value ?? []),
  });

  private readonly _repo = inject(RecipeRepository);
}
