import { A2uiRendererService, SurfaceComponent } from '@a2ui/angular/v0_9';
import type { A2uiMessage } from '@a2ui/web_core/v0_9';
import { A2UI_OPERATIONS_KEY } from '@ag-ui/a2ui-toolkit';
import type { AbstractAgent, ActivityMessage } from '@ag-ui/client';
import { Component, computed, effect, inject, input } from '@angular/core';
import { ActivityRenderer } from '@copilotkit/angular';
import { z } from 'zod';

/** Matches ACTIVITY_SNAPSHOT content emitted by the A2UI middleware. */
export const a2uiSurfaceContentSchema = z.object({
  [A2UI_OPERATIONS_KEY]: z.array(z.custom<A2uiMessage>()).optional(),
  status: z.string().optional(),
});

export type A2uiSurfaceContent = z.infer<typeof a2uiSurfaceContentSchema>;

/**
 * Renders `a2ui-surface` activity messages with `@a2ui/angular`, mirroring the
 * upstream restaurant sample: feed operations to `A2uiRendererService`, then
 * paint the surface with `<a2ui-v09-surface>`.
 */
@Component({
  selector: 'wm-a2ui-activity-renderer',
  imports: [SurfaceComponent],
  template: `
    @let surface = surfaceId();
    @if (surface) {
      <a2ui-v09-surface [surfaceId]="surface" />
    }
  `,
  styles: `
    :host {
      display: block;
      margin: 0.75rem 0;
    }
  `,
  providers: [A2uiRendererService],
})
export class A2uiActivityRenderer
  implements ActivityRenderer<A2uiSurfaceContent>
{
  readonly activityType = input.required<string>();
  readonly content = input.required<A2uiSurfaceContent>();
  readonly message = input.required<ActivityMessage>();
  readonly agent = input<AbstractAgent | undefined>();

  private _processedOperationsIndex = 0;
  private readonly _renderer = inject(A2uiRendererService);

  constructor() {
    effect(() => {
      let operations = this.content()[A2UI_OPERATIONS_KEY] ?? [];
      if (operations.length === 0) {
        return;
      }

      // For some reason, the `content` signal is updated with the same a2ui operations.
      // This can cause the renderer to process the same operations multiple times
      // and throw an existing surface error.
      operations = operations.slice(this._processedOperationsIndex);

      try {
        this._renderer.processMessages(operations);
        this._processedOperationsIndex += operations.length;
      } catch (error) {
        console.error('A2UI render error:', error);
      }
    });
  }

  protected readonly surfaceId = computed(() =>
    _getRenderedSurfaceId(this.content()[A2UI_OPERATIONS_KEY] ?? []),
  );
}

function _getRenderedSurfaceId(operations: A2uiMessage[]): string | null {
  for (const operation of operations) {
    if ('createSurface' in operation && operation.createSurface?.surfaceId) {
      return operation.createSurface.surfaceId;
    }

    if (
      'updateComponents' in operation &&
      operation.updateComponents?.surfaceId
    ) {
      return operation.updateComponents.surfaceId;
    }

    if (
      'updateDataModel' in operation &&
      operation.updateDataModel?.surfaceId
    ) {
      return operation.updateDataModel.surfaceId;
    }
  }

  return null;
}
