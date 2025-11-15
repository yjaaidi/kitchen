---
description: Writes wip code and tests based on design doc
---

# Context

- designDocPath: $ARGUMENTS[0]
- prNumber: $ARGUMENTS[1]

# Task

Based on the following design doc ${designDocPath}, write WIP code for implementation described in the design doc.

- Focus only on the PR #${prNumber} if provided.
- WIP classes, functions, and components are work-in-progress code that just throw "🚧 work in progress" errors but do not implement Angular component template or methods.
- They are Wiprecated, meaning that they have the following tag in their jsdoc "@deprecated 🚧 work in progress".
- Do not implement anything additional.
- Do not break anything existing.
- For WIP tests, put the test's steps from the design doc as-is in a comment inside the body of the "it.todo" test.

# Examples

### WIP class example

```ts
/**
 * @deprecated 🚧 work in progress
 */
class Greetings {
  hello() {
    throw new Error(`🚧 work in progress`);
  }
}
```

### WIP method example

```ts
class Greetings {
  /**
   * @deprecated 🚧 work in progress
   */
  hello() {
    throw new Error(`🚧 work in progress`);
  }
}
```

### WIP component

```ts
/**
 * @deprecated 🚧 work in progress
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-rules',
  template: `Rules - 🚧 work in progress`,
})
class Rules {
  rules = input.required<Rule[]>();
  ruleSelect = output<Rule>();
}
```

### WIP tests example

```ts
import { describe, it } from 'vitest';

describe(RuleSearch.name, () => {
  it.todo('search rules without filtering', () => {
    // mount RuleSearch
    // click on first rule
    // assert output was triggered once
  });

  it.todo('...', () => {
    // ...
  });
});
```
