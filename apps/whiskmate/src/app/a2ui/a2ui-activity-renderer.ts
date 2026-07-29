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
    @for (surfaceId of surfaceIds(); track surfaceId) {
      <a2ui-v09-surface [surfaceId]="surfaceId" />
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

  protected readonly surfaceIds = computed(() =>
    this._operations()
      .map((op) => _getOperationInfo(op))
      .filter(_isCreateSurfaceOperation)
      .map((operation) => operation.surfaceId),
  );

  private readonly _renderer = inject(A2uiRendererService);

  private readonly _createdSurfaceIds = new Set<string>();
  private readonly _operations = computed(
    () => this.content()[A2UI_OPERATIONS_KEY] ?? [],
  );

  constructor() {
    effect(() => {
      /**
       * `content` is replaced wholesale on each progressive ACTIVITY_SNAPSHOT
       * (replace: true). Re-apply the latest ops; only skip createSurface after
       * the surface already exists in this renderer instance.
       * On one hand, we do not want to apply the same createSurface operation
       * multiple times. On the other hand, an update operation might be replaced in
       * the operations array, therefore we can't just keep an index of the slice
       * of the operations already processed.
       */
      // 1. Filter out createSurface ops for surfaces already created here.
      const operations = this._operations().filter((op) => {
        const operationInfo = _getOperationInfo(op);
        return !(
          _isCreateSurfaceOperation(operationInfo) &&
          this._createdSurfaceIds.has(operationInfo.surfaceId)
        );
      });

      if (operations.length === 0) {
        return;
      }

      // 2. Apply the remaining operations.
      this._renderer.processMessages(operations);

      // 3. Record newly created surfaces.
      for (const operation of operations) {
        const operationInfo = _getOperationInfo(operation);
        if (_isCreateSurfaceOperation(operationInfo)) {
          this._createdSurfaceIds.add(operationInfo.surfaceId);
        }
      }
    });
  }
}

type A2uiOperationType =
  | 'createSurface'
  | 'updateComponents'
  | 'updateDataModel'
  | 'deleteSurface';

type A2uiOperationInfo = {
  surfaceId: string | undefined;
  operationType: A2uiOperationType | undefined;
};

type CreateSurfaceOperationInfo = {
  surfaceId: string;
  operationType: 'createSurface';
};

function _isCreateSurfaceOperation(
  operation: A2uiOperationInfo,
): operation is CreateSurfaceOperationInfo {
  return operation.operationType === 'createSurface' && !!operation.surfaceId;
}

function _getOperationInfo(operation: A2uiMessage): A2uiOperationInfo {
  if ('createSurface' in operation) {
    return {
      surfaceId: operation.createSurface?.surfaceId,
      operationType: 'createSurface',
    };
  }
  if ('updateComponents' in operation) {
    return {
      surfaceId: operation.updateComponents?.surfaceId,
      operationType: 'updateComponents',
    };
  }
  if ('updateDataModel' in operation) {
    return {
      surfaceId: operation.updateDataModel?.surfaceId,
      operationType: 'updateDataModel',
    };
  }
  if ('deleteSurface' in operation) {
    return {
      surfaceId: operation.deleteSurface?.surfaceId,
      operationType: 'deleteSurface',
    };
  }
  return { surfaceId: undefined, operationType: undefined };
}
