---
name: angular-testing
description: Angular testing guidelines and examples
---

- never use `vi.mock()` or mocks, spies, stubs in general, prefer fakes.
- never use `beforeEach` / `afterEach`, prefer setup functions.
- use our `ng-test-utils` instead of TestBed to configure/mount/inject.
- use `{componentName}.browser.spec.ts` name convention for component tests (e.g. `my-button.browser.spec.ts`). Do not use `.ng.spec.ts`
- use `page` API from `vitest/browser` to interact with the DOM. See https://vitest.dev/api/browser/locators.html for more information on locators and assertions.

## Angular component test example

```ts
import { describe, it } from 'vitest';
import { page } from 'vitest/browser';
import { Rules } from './rules.ng';
import {
  provideRulesRepositoryFake,
  RulesRepositoryFake,
} from './rules-repository.fake';
import { ruleMother } from '../testing/rule.mother';
import { t } from '../testing/ng-test-utils';

describe(RuleSearch.name, () => {
  it('search rules without filtering', async () => {
    const { ruleHeadings } = await renderComponent();

    await expect.element(ruleHeadings).toHaveLength(2);
    await expect.element(ruleHeadings.nth(0)).toHaveTextContent('Rule A');
    await expect.element(ruleHeadings.nth(1)).toHaveTextContent('Rule B');
  });

  async function renderComponent() {
    t.configure({providers: [provideRuleRepositoryFake()]});

    t.inject(RuleRepositoryFake).setRules([
        ruleMother.withBasicInfo('A Flexible Rule').build(),
        ruleMother.withBasicInfo('Some Strict Rule').build(),
    ])l;

    t.mount(RulesSearch);

    return {
      ruleHeadings: page.getByRole('heading'),
    };
  }
});
```

## Angular component output test example

```ts
describe(RuleList.name, () => {
  it('search rules without filtering', async () => {
    const ruleSelect = vi.fn<(rule: Rule) => void>();

    t.mount(RuleList, { outputs: { ruleSelect }});

    await page.getByRole('heading', {name: 'Burger'}).click();

    expect(ruleSelect).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({name: 'Burger'}))
  });
});
```

## Angular component test example with configuration before mount

```ts
import { describe, it } from 'vitest';
import { page } from 'vitest/browser';
import { Rules } from './rules.ng';
import {
  provideRulesRepositoryFake,
  RulesRepositoryFake,
} from './rules-repository.fake';
import { ruleMother } from '../testing/rule.mother';
import { t } from '../testing/ng-test-utils';

describe(RuleSearch.name, () => {
  it('search rules without filtering', async () => {
    const { mount, ruleRepoFake, ruleHeadings } = await setUp();

    ruleRepoFake.setRules([]);

    await mount();

    await expect.element(ruleHeadings).toHaveLength(0);
  });

  async function setUp() {
    t.configure({providers: [provideRuleRepositoryFake()]});

    const ruleRepoFake = t.inject(RuleRepositoryFake);
    ruleRepoFake.setRules([
      ruleMother.withBasicInfo('A Flexible Rule').build(),
      ruleMother.withBasicInfo('Some Strict Rule').build(),
    ])l;

    return {
      ruleRepoFake,
      async mount() {
        t.mount(RuleSearch);
        return {
          ruleHeadings: page.getByRole('heading'),
        };
      },
    };
  }
});
```
