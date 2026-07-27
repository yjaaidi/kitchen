import { Component, computed } from '@angular/core';
import {
  AngularCatalog,
  AngularComponentImplementation,
  CatalogComponent,
  ComponentHostComponent,
} from '@a2ui/angular/v0_9';
// Component *APIs* (names + prop schemas) are reused from the basic catalog —
// our subset speaks the same vocabulary — but the catalog id and every
// component *implementation* below are Whiskmate's own.
import {
  CardApi,
  ColumnApi,
  DividerApi,
  ListApi,
  RowApi,
  TextApi,
} from '@a2ui/web_core/v0_9/basic_catalog';

/**
 * Whiskmate's own catalog id. MUST stay identical to `RECIPE_A2UI_CATALOG_ID`
 * in `apps/commis/src/a2ui/recipe-catalog.ts` — the backend stamps it on
 * `createSurface` operations and this frontend catalog resolves them.
 */
export const WHISKMATE_CATALOG_ID =
  'https://whiskmate.dev/a2ui/recipe-catalog-v1.json';

@Component({
  selector: 'wm-a2ui-text',
  template: `
    @switch (variant()) {
      @case ('h1') { <h1>{{ text() }}</h1> }
      @case ('h2') { <h2>{{ text() }}</h2> }
      @case ('h3') { <h3>{{ text() }}</h3> }
      @case ('h4') { <h4>{{ text() }}</h4> }
      @case ('h5') { <h5>{{ text() }}</h5> }
      @case ('caption') { <small>{{ text() }}</small> }
      @default { <p>{{ text() }}</p> }
    }
  `,
  styles: `
    h1, h2, h3, h4, h5, p { margin: 0; }
    h3 { font-size: 1.25rem; }
    h4 { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.06em; opacity: 0.6; }
    p { line-height: 1.5; white-space: pre-line; }
    small { opacity: 0.6; }
  `,
})
export class WmTextComponent extends CatalogComponent<typeof TextApi> {
  protected readonly text = computed(() => this.props().text?.value() ?? '');
  protected readonly variant = computed(
    () => this.props().variant?.value() ?? 'body',
  );
}

@Component({
  selector: 'wm-a2ui-column',
  imports: [ComponentHostComponent],
  template: `
    @for (child of children(); track child.basePath + '/' + child.id) {
      <a2ui-v09-component-host [componentKey]="child" [surfaceId]="surfaceId()" />
    }
  `,
  styles: `
    :host { display: flex; flex-direction: column; gap: 0.75rem; }
  `,
})
export class WmColumnComponent extends CatalogComponent<typeof ColumnApi> {
  protected readonly children = computed(
    () => this.props().children?.value() ?? [],
  );
}

@Component({
  selector: 'wm-a2ui-row',
  imports: [ComponentHostComponent],
  template: `
    @for (child of children(); track child.basePath + '/' + child.id) {
      <a2ui-v09-component-host [componentKey]="child" [surfaceId]="surfaceId()" />
    }
  `,
  styles: `
    :host { display: flex; flex-direction: row; gap: 0.75rem; align-items: center; }
  `,
})
export class WmRowComponent extends CatalogComponent<typeof RowApi> {
  protected readonly children = computed(
    () => this.props().children?.value() ?? [],
  );
}

@Component({
  selector: 'wm-a2ui-card',
  imports: [ComponentHostComponent],
  template: `
    @if (child(); as c) {
      <a2ui-v09-component-host [componentKey]="c" [surfaceId]="surfaceId()" />
    }
  `,
  styles: `
    :host {
      display: block;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 0.75rem;
      padding: 1rem 1.25rem;
      background: #fffdf9;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
    }
  `,
})
export class WmCardComponent extends CatalogComponent<typeof CardApi> {
  protected readonly child = computed(() => this.props().child?.value());
}

@Component({
  selector: 'wm-a2ui-list',
  imports: [ComponentHostComponent],
  template: `
    <ul [class.horizontal]="direction() === 'horizontal'">
      @for (child of children(); track child.basePath + '/' + child.id) {
        <li>
          <a2ui-v09-component-host [componentKey]="child" [surfaceId]="surfaceId()" />
        </li>
      }
    </ul>
  `,
  styles: `
    ul { margin: 0; padding-inline-start: 1.25rem; display: flex; flex-direction: column; gap: 0.25rem; }
    ul.horizontal { flex-direction: row; gap: 0.75rem; list-style: none; padding: 0; }
  `,
})
export class WmListComponent extends CatalogComponent<typeof ListApi> {
  protected readonly children = computed(
    () => this.props().children?.value() ?? [],
  );
  protected readonly direction = computed(
    () => this.props().direction?.value() ?? 'vertical',
  );
}

@Component({
  selector: 'wm-a2ui-divider',
  template: '',
  styles: `
    :host { display: block; border-top: 1px solid rgba(0, 0, 0, 0.1); margin: 0.25rem 0; }
  `,
})
export class WmDividerComponent extends CatalogComponent<typeof DividerApi> {}

const WHISKMATE_COMPONENTS: AngularComponentImplementation[] = [
  { ...TextApi, component: WmTextComponent },
  { ...ColumnApi, component: WmColumnComponent },
  { ...RowApi, component: WmRowComponent },
  { ...CardApi, component: WmCardComponent },
  { ...ListApi, component: WmListComponent },
  { ...DividerApi, component: WmDividerComponent },
];

/** Whiskmate's own A2UI catalog — a simple subset of the basic catalog vocabulary. */
export function createWhiskmateCatalog(): AngularCatalog {
  return new AngularCatalog(WHISKMATE_CATALOG_ID, WHISKMATE_COMPONENTS);
}
