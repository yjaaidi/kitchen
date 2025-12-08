import { ChangeDetectionStrategy, Component } from '@angular/core';
import { injectRecipeResolverData } from './recipe.resolver';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-recipe-viewer',
  imports: [],
  template: `
    @if (resource.isLoading()) {
    <div>Loading...</div>
    } @if (resource.hasValue()) {
    <div>{{ resource.value() }}</div>
    }
  `,
})
export class RecipeViewer {
  resource = injectRecipeResolverData();
}

export default RecipeViewer;
