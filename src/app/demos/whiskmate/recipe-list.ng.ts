import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  contentChild,
  Directive,
  inject,
  input,
  linkedSignal,
  Resource,
  ResourceSnapshot,
  signal,
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
          @if (actions().templateRef; as templateRef) {
            <ng-container
              [ngTemplateOutlet]="templateRef"
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

  protected readonly actions = contentChild.required(RecipeActions);
}

type RecipeActionsContext = { $implicit: Recipe };

@Directive({
  selector: 'ng-template[recipeActions]',
})
export class RecipeActions {
  readonly templateRef = inject(TemplateRef<RecipeActionsContext>);

  static ngTemplateContextGuard(dir: RecipeActions, ctx: any): ctx is RecipeActionsContext {
    return true;
  }
}
