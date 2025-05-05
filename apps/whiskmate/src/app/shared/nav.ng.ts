import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { rxComputed } from '@jscutlery/rx-computed';
import { map } from 'rxjs/operators';

export interface Link {
  name: string;
  route: string[];
  queryParams?: Record<string, string>;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-nav',
  imports: [
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    RouterLink,
    RouterLinkActive,
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav
        #drawer
        class="sidenav"
        fixedInViewport
        [attr.role]="isHandset() ? 'dialog' : 'navigation'"
        [mode]="isHandset() ? 'over' : 'side'"
        [opened]="!isHandset()"
      >
        <mat-nav-list>
          @for (link of links(); track link) {
            <a
              #routerLinkActive="routerLinkActive"
              [activated]="routerLinkActive.isActive"
              [routerLink]="link.route"
              [queryParams]="link.queryParams"
              (click)="drawer.mode === 'over' && drawer.toggle()"
              mat-list-item
              routerLinkActive
              >{{ link.name }}</a
            >
          }
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar color="primary">
          @if (isHandset()) {
            <button
              type="button"
              aria-label="Toggle sidenav"
              mat-icon-button
              (click)="drawer.toggle()"
            >
              <mat-icon aria-label="Side nav toggle icon">menu</mat-icon>
            </button>
          }
          <span>{{ title() }}</span>
        </mat-toolbar>
        <ng-content />
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
      .sidenav-container {
        height: 100%;
      }

      .sidenav {
        width: 200px;
      }
    `,
  ],
})
export class Nav {
  links = input.required<Link[]>();
  title = input.required<string>();

  isHandset = rxComputed(() =>
    this._breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(map((result) => result.matches)),
  );

  private _breakpointObserver = inject(BreakpointObserver);
}
