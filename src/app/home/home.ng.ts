import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface DemoLink {
  path: string;
  title: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <section class="home">
      <p>
        Each route demonstrates one deliberate performance problem. Use Angular DevTools or the
        browser Performance tab to observe the impact.
      </p>

      <ul class="demo-list">
        @for (demo of demos; track demo.path) {
          <li>
            <a [routerLink]="demo.path">{{ demo.title }}</a>
          </li>
        }
      </ul>
    </section>
  `,
  styles: `
    .home {
      max-width: 720px;
      margin: 0 auto;
      padding: 1rem;
    }

    .demo-list {
      list-style: none;
      padding: 0;
    }

    .demo-list li {
      margin-bottom: 1rem;
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 8px;
    }

    .demo-list a {
      font-weight: 600;
      font-size: 1.1rem;
    }
  `,
})
export class HomeComponent {
  protected readonly demos: DemoLink[] = [
    {
      path: '/demos/slow-synchronization',
      title: 'Slow Synchronization',
    },
    {
      path: '/demos/slow-filtering',
      title: 'Slow Filtering',
    },
    {
      path: '/demos/network-congestion',
      title: 'Network Congestion',
    },
  ];
}
