<!--
Sync Impact Report:
- Version: NEW → 1.0.0
- Type: MAJOR (initial constitution ratification)
- Modified principles: N/A (initial version)
- Added sections: All core principles, development workflow, governance
- Removed sections: N/A
- Templates requiring updates:
  ✅ plan-template.md - Reviewed, no updates needed (generic placeholders align with principles)
  ✅ spec-template.md - Reviewed, no updates needed (generic requirements template)
  ✅ tasks-template.md - Reviewed, no updates needed (generic task structure)
  ⚠ No command files exist yet in .specify/templates/commands/
- Follow-up TODOs: None
-->

# Whiskmate Constitution

## Core Principles

### I. Standalone Components (NON-NEGOTIABLE)

All Angular components, directives, and pipes MUST be standalone. Module-based architecture is prohibited.

**Rationale**: Standalone components are the modern Angular standard, providing better tree-shaking, simpler mental model, and reduced boilerplate. This decision aligns with Angular's recommended direction and simplifies testing.

### II. Modern Angular Patterns

Components MUST use modern Angular APIs and patterns:

- Signals over observables for state management
- `input()` and `output()` functions instead of `@Input()` and `@Output()` decorators
- Control flow syntax (`@if`, `@for`) instead of structural directives (`*ngIf`, `*ngIf`)
- `rxResource` for transforming observables to signals when needed in views
- `inject()` function for dependency injection in component logic
- Avoid the `effect()` function; prefer computed signals or explicit reactivity

**Rationale**: These patterns leverage Angular's latest reactive primitives, improve type safety, reduce complexity, and follow framework best practices for modern Angular development.

### III. Component File Naming Convention (NON-NEGOTIABLE)

Components MUST use `.ng.ts` extension instead of `.component.ts`. Non-component files (services, models, utilities) use standard `.ts` extension.

**Rationale**: The `.ng.ts` extension provides clear visual distinction between components and other TypeScript files, improving navigation and reducing cognitive load when browsing the codebase.

### IV. Inline Templates & Styles

Components MUST use inline templates and inline styles within the `@Component` decorator. Do not include the `styles` field unless styles are actually present.

**Rationale**: Inline templates keep component logic and presentation together, reducing context switching. For this application's component complexity, inline templates remain maintainable and improve developer experience.

### V. Testing Discipline (NON-NEGOTIABLE)

All tests MUST follow these principles:

- Use fakes instead of mocks, spies, or stubs
- No `beforeEach` or `afterEach` hooks; use setup functions instead
- Use the project's `ng-test-utils` (`t.configure`, `t.mount`, `t.inject`) instead of TestBed directly or Testing Library's `render`
- Test file naming: `{component-name}.spec.ts` (e.g., `recipe-search.spec.ts`), NOT `.ng.spec.ts`
- Tests must be independently readable with explicit setup

**Rationale**: Fakes provide realistic test doubles that can be reused and maintain contract integrity. Setup functions make tests more explicit and easier to debug. Custom test utilities reduce boilerplate while maintaining full control.

### VI. OnPush Change Detection

All components MUST use `ChangeDetectionStrategy.OnPush`.

**Rationale**: OnPush change detection is optimal for signal-based components, reduces unnecessary rendering, and enforces immutable data patterns that improve application performance.

### VII. Simplicity & Convention

- Component selectors MUST use the `wm-` prefix (workspace prefix for Whiskmate)
- Keep components focused and single-purpose
- Avoid premature abstraction; extract common patterns only when patterns emerge naturally
- Prefer composition over inheritance
- YAGNI: You Aren't Gonna Need It - build only what's required now

**Rationale**: Clear conventions reduce decision fatigue. Simplicity and focused components improve maintainability and testability.

## Development Workflow

### Code Organization

- **Components**: Organized by feature domain (e.g., `recipe/`, `meal-planner/`, `shared/`)
- **Shared utilities**: Place in `shared/` directory only when used by multiple features
- **Testing utilities**: Keep in `testing/` directory (e.g., `ng-test-utils.ts`, mother builders)
- **Fakes**: Co-locate with real implementations, named `{service-name}.fake.ts`

### Testing Strategy

- **Unit tests**: Test component behavior through user interactions, not implementation details
- **Integration**: Use fakes to test component integration with services
- **Test utilities**: Extend `ng-test-utils` for common testing patterns
- **Mother builders**: Use builder pattern for test data generation (e.g., `recipeMother`)

### Quality Standards

- All components MUST have `ChangeDetectionStrategy.OnPush` explicitly set
- Components MUST NOT include empty `styles` field
- TypeScript strict mode is enforced
- ESLint rules must pass without warnings
- Test coverage expected for all feature components

## Governance

### Amendment Procedure

1. Constitution changes MUST be documented with rationale
2. Version MUST be updated following semantic versioning:
   - **MAJOR**: Backward incompatible changes (removing/redefining core principles)
   - **MINOR**: New principles added or materially expanded guidance
   - **PATCH**: Clarifications, wording improvements, non-semantic refinements
3. Sync Impact Report MUST be generated and included at top of constitution file
4. Dependent templates MUST be reviewed and updated if affected

### Compliance Review

- Pull requests SHOULD verify alignment with constitution principles
- New features MUST follow established patterns (use existing components as reference)
- Deviations from constitution MUST be justified and documented
- Constitution takes precedence over individual preferences

### Versioning Policy

Constitution version is tracked independently from application version. Each amendment updates `LAST_AMENDED_DATE` and increments `CONSTITUTION_VERSION` appropriately.

**Version**: 1.0.0 | **Ratified**: 2025-11-15 | **Last Amended**: 2025-11-15
