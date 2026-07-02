import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  contentChild,
  input,
  linkedSignal,
  Resource,
  ResourceSnapshot,
  TemplateRef,
} from '@angular/core';
import { Recipe } from '../../recipe/recipe';
import { Catalog } from '../../shared/catalog.ng';
import { RecipePreview } from './recipe-preview.ng';

@Component({
  selector: 'app-recipe-list',
  imports: [Catalog, NgTemplateOutlet, RecipePreview],
  template: `
    <app-catalog>
      @if (recipesResource().isLoading()) {
        <div role="status">Loading recipes...</div>
      }
      @for (recipe of recipes(); track recipe.id) {
        <app-recipe-preview [recipe]="recipe">
          @if (actionsTemplate(); as template) {
            <ng-container
              [ngTemplateOutlet]="template"
              [ngTemplateOutletContext]="{ $implicit: recipe }"
            />
          }
        </app-recipe-preview>
      }
    </app-catalog>
  `,
})
export class RecipeList {
  recipesResource = input.required<Resource<Recipe[]>>();

  protected readonly recipes = linkedSignal<ResourceSnapshot<Recipe[]>, Recipe[]>({
    source: () => this.recipesResource().snapshot(),
    computation: (snapshot, prev) =>
      snapshot.status === 'resolved' ? snapshot.value : (prev?.value ?? []),
  });

  protected readonly actionsTemplate =
    contentChild.required<TemplateRef<{ $implicit: Recipe }>>(TemplateRef);
}
