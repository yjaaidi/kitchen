import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-recipe-viewer',
  imports: [],
  template: `🚧 &lt;RecipeViewer&gt; 🚧`,
})
export class RecipeViewer {}

export default RecipeViewer;
