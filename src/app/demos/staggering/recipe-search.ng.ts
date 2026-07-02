import {
  ChangeDetectionStrategy,
  Component,
  inject,
  linkedSignal,
  resource,
  ResourceSnapshot,
} from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { RecipeAddButton } from '../../meal-planner/recipe-add-button.ng';
import { Recipe } from '../../recipe/recipe';
import { RecipeRepository } from '../../recipe/recipe-repository';
import { Catalog } from '../../shared/catalog.ng';
import { RecipePreview } from './recipe-preview.ng';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-recipe-search',
  imports: [Catalog, RecipeAddButton, RecipePreview],
  template: `
    @defer (on timer(500)) {
      <section class="recipes" aria-labelledby="recipes-heading">
        <h2 id="recipes-heading">Recipes</h2>

        @defer (on timer(500)) {
          <app-catalog class="catalog">
            @if (recipesResource.isLoading()) {
              <div role="status">Loading recipes...</div>
            }
            @for (recipe of recipes(); track recipe.id) {
              @defer (on timer(500)) {
                <app-recipe-preview [recipe]="recipe">
                  <app-recipe-add-button [recipe]="recipe" />
                </app-recipe-preview>
              } @placeholder {
                <div class="recipe-placeholder" aria-hidden="true"></div>
              }
            }
          </app-catalog>
        } @placeholder {
          <div class="catalog-placeholder" role="status">Loading catalog...</div>
        }
      </section>
    } @placeholder {
      <div class="recipes-placeholder" role="status">Loading recipes section...</div>
    }
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

    .recipes-placeholder,
    .catalog-placeholder {
      text-align: center;
      color: #666;
      font-size: 0.875rem;
      padding: 2rem 1rem;
    }

    .catalog-placeholder {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .recipe-placeholder {
      width: 300px;
      height: 380px;
      border-radius: 10px;
      background: #f5f5f5;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
  `,
})
export default class StaggeringDemo {
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
