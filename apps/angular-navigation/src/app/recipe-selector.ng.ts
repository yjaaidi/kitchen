import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RecipeRepository } from './recipe-repository';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-recipe-selector',
  imports: [FormsModule, RouterLink],
  template: `
    <h1>Recipe Selector</h1>
    <ul>
      @for (recipe of recipesWithChecked(); track recipe.id) {
      <li>
        <input
          type="checkbox"
          [ngModel]="recipe.isSelected"
          (ngModelChange)="selectRecipe(recipe.id, $event)"
        />
        <span>{{ recipe.name }}</span>
      </li>
      }
    </ul>
    <a routerLink="/viewer" [queryParams]="{ recipe_id: selectedRecipeIds() }">
      <button [disabled]="!canView()">VIEW</button>
    </a>
  `,
})
export class RecipeSelector {
  canView = computed(() => this.selectedRecipeIds().length > 0);
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
  selectedRecipeIds = signal<string[]>([]);

  private _repository = inject(RecipeRepository);

  selectRecipe(id: string, isSelected: boolean) {
    this.selectedRecipeIds.update((ids) =>
      isSelected ? [...ids, id] : ids.filter((id) => id !== id)
    );
  }
}

export default RecipeSelector;
