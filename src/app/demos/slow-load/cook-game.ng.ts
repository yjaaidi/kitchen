import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  NgZone,
  signal,
  viewChild,
} from '@angular/core';
import { CookGameScene } from './cook-game-scene';
import { COOK_GAME_DATA } from './cook-game-data';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-cook-game',
  template: `
    <div class="cook-game">
      <canvas
        #canvas
        class="canvas"
        role="img"
        aria-label="Interactive 3D kitchen. Click the knife to chop vegetables, then place them on the pan or in the oven."
        tabindex="0"
      ></canvas>
      <p class="status" aria-live="polite">{{ status() }}</p>
    </div>
  `,
  styles: `
    .cook-game {
      max-width: 960px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .canvas {
      display: block;
      width: 100%;
      height: 420px;
      border-radius: 12px;
      border: 1px solid #ddd;
      background: #f5f0e8;
      cursor: pointer;
      touch-action: none;
    }

    .canvas:focus-visible {
      outline: 2px solid #2563eb;
      outline-offset: 2px;
    }

    .status {
      margin: 0.75rem 0 0;
      text-align: center;
      color: #444;
      font-size: 0.875rem;
    }
  `,
})
export class CookGame {
  private readonly _canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly _dummyData = COOK_GAME_DATA;
  private readonly _zone = inject(NgZone);

  protected readonly status = signal('Pick up the knife or an ingredient.');

  constructor() {
    effect((onCleanup) => {
      const canvas = this._canvas().nativeElement;
      let scene!: CookGameScene;

      this._zone.runOutsideAngular(() => {
        scene = new CookGameScene(canvas, (message) => {
          this._zone.run(() => this.status.set(message));
        });
      });

      onCleanup(() => {
        scene.dispose();
      });
    });
  }
}
