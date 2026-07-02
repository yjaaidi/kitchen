import { NgComponentOutlet } from '@angular/common';
import {
  Component,
  InputSignal,
  input,
  linkedSignal,
  Resource,
  ResourceSnapshot,
  Type,
} from '@angular/core';
import { Recipe } from '../../recipe/recipe';
import { Catalog } from '../../shared/catalog.ng';
import { RecipePreview } from './recipe-preview.ng';

@Component({
  selector: 'app-recipe-list',
  imports: [Catalog, NgComponentOutlet, RecipePreview],
  template: `
    <app-catalog>
      @if (recipesResource().isLoading()) {
        <div role="status">Loading recipes...</div>
      }
      @for (recipe of recipes(); track recipe.id) {
        <app-recipe-preview [recipe]="recipe">
          <ng-container [ngComponentOutlet]="actions()" [ngComponentOutletInputs]="{ recipe }" />
        </app-recipe-preview>
      }
    </app-catalog>
  `,
})
export class RecipeList {
  recipesResource = input.required<Resource<Recipe[]>>();
  actions = input.required<Type<RecipeAction>>();

  protected readonly recipes = linkedSignal<ResourceSnapshot<Recipe[]>, Recipe[]>({
    source: () => this.recipesResource().snapshot(),
    computation: (snapshot, prev) =>
      snapshot.status === 'resolved' ? snapshot.value : (prev?.value ?? []),
  });
}

export interface RecipeAction {
  recipe: InputSignal<Recipe>;
}
