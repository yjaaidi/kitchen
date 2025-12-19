const type = {
  app: 'type:app',
  core: 'type:core',
  domain: 'type:domain',
  feature: 'type:feature',
  infra: 'type:infra',
  testing: 'type:testing',
  ui: 'type:ui',
  util: 'type:util',
};

const commonAllowedExternalImports = [
  /* `lit` is used in util for controllers. */
  'lit',
  'rxjs',
];
const commonUiAllowedExternalImports = [
  ...commonAllowedExternalImports,
  'lit/decorators.js',
  'lit/directives/*.js',
];

/**
 * @type {import('@nx/eslint-plugin/src/rules/enforce-module-boundaries').DepConstraint[]}
 */
export default [
  /**
   * Type boundaries.
   */
  {
    sourceTag: type.app,
    onlyDependOnLibsWithTags: [
      type.core,
      type.domain,
      type.feature,
      type.infra,
      type.ui,
      type.util,
    ],
    allowedExternalImports: commonAllowedExternalImports,
  },
  {
    sourceTag: type.feature,
    onlyDependOnLibsWithTags: [
      type.core,
      type.domain,
      type.feature,
      type.infra,
      type.ui,
      type.util,
    ],
    allowedExternalImports: [...commonUiAllowedExternalImports, '@lit/task'],
  },
  {
    sourceTag: type.ui,
    onlyDependOnLibsWithTags: [type.core, type.ui, type.util],
    allowedExternalImports: commonUiAllowedExternalImports,
  },
  {
    sourceTag: type.domain,
    onlyDependOnLibsWithTags: [type.core, type.domain, type.infra, type.util],
    allowedExternalImports: commonAllowedExternalImports,
  },
  {
    sourceTag: type.infra,
    onlyDependOnLibsWithTags: [type.core, type.infra, type.util],
    allowedExternalImports: commonAllowedExternalImports,
  },
  {
    sourceTag: type.core,
    onlyDependOnLibsWithTags: [type.core, type.util],
    allowedExternalImports: commonAllowedExternalImports,
  },
  {
    sourceTag: type.util,
    onlyDependOnLibsWithTags: [type.util],
    allowedExternalImports: commonAllowedExternalImports,
  },
];
