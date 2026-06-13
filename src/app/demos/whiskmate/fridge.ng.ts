import { Component } from '@angular/core';

@Component({
  selector: 'app-fridge',
  templateUrl: './fridge.svg',
  host: {
    'aria-hidden': 'true',
    class: 'fridge',
  },
  styles: `
    :host {
      display: block;
      width: min(200px, 60vw);
      margin-bottom: 1.5rem;
    }

    svg {
      width: 100%;
      height: auto;
    }
  `,
})
export class Fridge {}
