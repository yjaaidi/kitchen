import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav>
      <a routerLink="/selector">Selector</a>
      <a routerLink="/viewer">Viewer</a>
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
export class App {}
