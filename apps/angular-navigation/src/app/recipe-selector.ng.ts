import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  linkedSignal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RecipeRepository } from './recipe-repository';
import { RecipeStore } from './recipe.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-recipe-selector',
  imports: [FormsModule, RouterLink],
  template: `
    <h1>Recipe Selector</h1>
    @if (recipes.isLoading()) {
      <div>Loading...</div>
    }
    <ul>
      @for (recipe of recipesWithChecked(); track recipe.id) {
        <li>
          <input
            type="checkbox"
            [ngModel]="recipe.isSelected"
            (ngModelChange)="updateRecipeSelection(recipe.id, $event)"
          />
          <span>{{ recipe.name }}</span>
        </li>
      }
    </ul>
    <a routerLink="/viewer" [queryParams]="viewRecipesQueryParams()">
      <button [disabled]="!canView()">VIEW</button>
    </a>
  `,
})
export class RecipeSelector {
  canView = computed(() => {
    const recipeIds = this.userSelectedRecipeIds();
    return recipeIds && recipeIds.length > 0;
  });
  viewRecipesQueryParams = computed(() => {
    const recipeIds = this.userSelectedRecipeIds();
    return recipeIds
      ? {
          recipe_id: recipeIds,
          another: Array.from({ length: 100_000 }, () => 'a').join(''),
        }
      : null;
  });
  recipes = rxResource({
    stream: () => this._repository.fetchRecipes(),
  });
  recipesWithChecked = computed(() => {
    return (
      this.recipes.value()?.map((recipe) => ({
        ...recipe,
        isSelected: this.selectedRecipeIds().includes(recipe.id),
      })) ?? []
    );
  });
  selectedRecipeIds = computed(() => this._recipeStore.selectedRecipeIds());
  userSelectedRecipeIds = linkedSignal(() => this.selectedRecipeIds());

  private _recipeStore = inject(RecipeStore);
  private _repository = inject(RecipeRepository);

  async updateRecipeSelection(recipeId: string, shouldSelect: boolean) {
    let selectedRecipeIds = this.userSelectedRecipeIds();
    if (shouldSelect) {
      selectedRecipeIds = [...selectedRecipeIds, recipeId];
    } else {
      selectedRecipeIds = selectedRecipeIds.filter((id) => recipeId !== id);
    }
    this.userSelectedRecipeIds.set(selectedRecipeIds);
  }
}

export default RecipeSelector;
