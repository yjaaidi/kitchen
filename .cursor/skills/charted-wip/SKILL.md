---
name: charted-wip
description: Writes wip code and tests based on design doc
---

# Context

- designDocPath: $ARGUMENTS[0]
- prNumber: $ARGUMENTS[1]

# Task

Based on the following design doc ${designDocPath}, write WIP code for implementation described in the design doc.

- Focus only on the PR #${prNumber} if provided.
- If you add a new class, function, or method, make it throw a "🚧 work in progress" error and add the "@deprecated 🚧 work in progress" tag to its jsdoc.
- If you add a new component, make it throw a "🚧 work in progress" error and add the "@deprecated 🚧 work in progress" tag to its jsdoc but do not implement the template or methods.
- Do not implement anything additional.
- **DO NOT CHANGE ANY EXISTING BEHAVIOR**.
  - If you change a function or a method signature in a retro-compatible way, do not throw a "🚧 work in progress" error.
  - If the function or method receives a new optional parameter, make it throw a "🚧 work in progress" error if the parameter is set.
  - Even if the goal of the PR is to change the behavior of an existing function or method, do not throw a "🚧 work in progress" error. **KEEP THE EXISTING BEHAVIOR**.
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

Note: test names start in lower case (e.g. "search rules ...").

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
