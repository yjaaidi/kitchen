import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RecipeRepository } from './recipe-repository';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-recipe-selector',
  imports: [FormsModule],
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
  `,
})
export class RecipeSelector {
  private _repository = inject(RecipeRepository);

  recipes = rxResource({
    stream: () => this._repository.fetchRecipes(),
  });
  selectedRecipeIds = signal<string[]>([]);

  recipesWithChecked = computed(() => {
    return (
      this.recipes.value()?.map((recipe) => ({
        ...recipe,
        isSelected: this.selectedRecipeIds().includes(recipe.id),
      })) ?? []
    );
  });

  selectRecipe(id: string, isSelected: boolean) {
    this.selectedRecipeIds.update((ids) =>
      isSelected ? [...ids, id] : ids.filter((id) => id !== id)
    );
  }
}

export default RecipeSelector;
