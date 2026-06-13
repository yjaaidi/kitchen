import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-card',
  template: `
    @if (pictureUri()) {
      <img class="picture" [src]="pictureUri()!" [width]="300" [height]="300" [alt]="alt()" />
    }

    <div class="content">
      <ng-content />
    </div>
  `,
  styles: `
    :host {
      display: block;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      text-align: left;
      width: 300px;
    }

    .picture {
      object-fit: cover;
      height: 300px;
      width: 100%;
    }

    .content {
      margin: 10px;
    }
  `,
})
export class Card {
  pictureUri = input<string>();
  alt = input<string>('Recipe picture');
}
