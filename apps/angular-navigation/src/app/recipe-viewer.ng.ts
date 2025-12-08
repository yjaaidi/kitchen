import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { RecipeStore } from './recipe.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-recipe-viewer',
  template: `
    <h1>Recipe Viewer</h1>
    @if (selectedRecipes.isLoading()) {
      <div>Loading...</div>
    }

    @if (hasNoRecipesSelected()) {
      <div>No recipes selected</div>
    }

    @for (recipe of selectedRecipes.value(); track recipe.id) {
      <div>
        <h2>{{ recipe?.name }}</h2>
      </div>
    }
  `,
})
export class RecipeViewer {
  selectedRecipes = inject(RecipeStore).selectedRecipes;
  hasNoRecipesSelected = computed(() => {
    return (
      this.selectedRecipes.status() === 'idle' &&
      !this.selectedRecipes.hasValue()
    );
  });
}

export default RecipeViewer;
