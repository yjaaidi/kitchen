import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <h1>Common Performance Issues</h1>
      <nav class="nav" aria-label="Demo navigation">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }"
          >Home</a
        >
        <a routerLink="/demos/slow-synchronization" routerLinkActive="active"
          >Slow Synchronization</a
        >
        <a routerLink="/demos/slow-filtering" routerLinkActive="active">Slow Filtering</a>
        <a routerLink="/demos/network-congestion" routerLinkActive="active">Network Congestion</a>
      </nav>
    </header>

    <main class="main">
      <router-outlet />
    </main>
  `,
  styles: `
    .header {
      padding: 1rem;
      border-bottom: 1px solid #ddd;
      text-align: center;
    }

    .header h1 {
      margin: 0 0 1rem;
      font-size: 1.5rem;
    }

    .nav {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem 1rem;
      justify-content: center;
    }

    .nav a {
      text-decoration: none;
      color: #333;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }

    .nav a.active {
      background: #333;
      color: #fff;
    }

    .main {
      min-height: calc(100vh - 120px);
    }
  `,
})
export class App {}
