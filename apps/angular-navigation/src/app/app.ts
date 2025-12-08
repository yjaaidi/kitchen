import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { recipeViewerRouterHelper } from './recipe-viewer.router-helper';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav>
      <a routerLink="/landing">Landing</a>
      <a routerLink="/selector" queryParamsHandling="merge">Selector</a>
      <a [routerLink]="viewerRoute.path" queryParamsHandling="merge">Viewer</a>
    </nav>
    <router-outlet />
  `,
  styles: [
    `
      nav {
        display: flex;
        gap: 1rem;
      }
    `,
  ],
})
export class App {
  viewerRoute = recipeViewerRouterHelper.route();
}
