import { A2UI_RENDERER_CONFIG } from '@a2ui/angular/v0_9';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideCopilotKit,
  RENDER_A2UI_TOOL_NAME,
  RenderA2UIArgsSchema,
} from '@copilotkit/angular';
import {
  A2uiActivityRenderer,
  a2uiSurfaceContentSchema,
} from './a2ui/a2ui-activity-renderer';
import { A2uiToolRendererNoop } from './a2ui/a2ui-tool-renderer-noop';
import { createWhiskmateCatalog } from './a2ui/whiskmate-catalog';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideCopilotKit({
      // runtimeUrl is set after sign-in via CopilotKit.updateRuntime so the
      // initial /info handshake always includes the Authorization header.
      runtimeUrl: undefined,

      // No `a2ui` here — the catalog is owned by the backend runtime. Surfaces
      // are painted with @a2ui/angular through the activity renderer; the noop
      // tool renderer keeps the built-in Lit render_a2ui UI from doubling up.
      a2ui: { includeSchema: false },
      renderActivityMessages: [
        {
          activityType: 'a2ui-surface',
          content: a2uiSurfaceContentSchema,
          component: A2uiActivityRenderer,
        },
      ],
      // Bypass the @copilotkit/angular Lit-based render_a2ui tool renderer.
      renderToolCalls: [
        {
          name: RENDER_A2UI_TOOL_NAME,
          args: RenderA2UIArgsSchema,
          component: A2uiToolRendererNoop,
        },
      ],
      suggestionsConfig: [
        {
          suggestions: [
            {
              title: 'Add recipe',
              message: 'Add a recipe to my favorites',
            },
            {
              title: 'View recipes',
              message: 'View my favorite recipes',
            },
          ],
        },
      ],
    }),
    // @a2ui/angular renderer with Whiskmate's own catalog (not the basic
    // catalog). The catalog id must match the backend's defaultCatalogId.
    {
      provide: A2UI_RENDERER_CONFIG,
      useValue: { catalogs: [createWhiskmateCatalog()] },
    },
  ],
};
