import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Nav } from './shared/nav.ng';

@Component({
  imports: [RouterOutlet, Nav],
  selector: 'wm-app',
  template: `
    <wm-nav [links]="links" title="👨🏻‍🍳 Whiskmate">
      <router-outlet />
    </wm-nav>
  `,
})
export class App {
  links = [{ name: 'Search', route: ['/search'] }];
}
