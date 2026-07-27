import { Component, input } from '@angular/core';
import {
  AngularToolCall,
  RENDER_A2UI_TOOL_NAME,
  RenderA2UIArgs,
  RenderA2UIArgsSchema,
  RenderToolCallConfig,
  ToolRenderer,
} from '@copilotkit/angular';

/**
 * Suppresses CopilotKit's built-in Lit `CopilotA2UIToolRenderer` for
 * `render_a2ui`. Surfaces are painted by the `@a2ui/angular` activity renderer
 * from ACTIVITY_SNAPSHOT events instead — without this override the surface
 * would render twice (Lit + Angular).
 */
@Component({ template: '' })
export class A2uiToolRendererNoop implements ToolRenderer<RenderA2UIArgs> {
  readonly toolCall = input.required<AngularToolCall<RenderA2UIArgs>>();
}

export const a2uiToolRendererConfig: RenderToolCallConfig<RenderA2UIArgs> = {
  name: RENDER_A2UI_TOOL_NAME,
  args: RenderA2UIArgsSchema,
  component: A2uiToolRendererNoop,
};
