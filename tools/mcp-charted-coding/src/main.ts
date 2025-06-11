import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

const server = new McpServer({
  name: 'Charted Coding',
  version: '0.1.0',
});

const designDocPath = z.string({
  description: 'The path of the design doc',
});

const testFilePath = z.string({
  description: 'The path of the test file',
});

/*
 * Using tools instead of prompts — which should be a better fit —
 * because prompts are not supported by IDEs such as Cursor or VSCode.
 */

server.tool(
  'charted_scaffold',
  'Returns instructions on how to scaffold files based on design doc',
  {
    designDocPath,
  },
  async ({ designDocPath }) =>
    makeBasicResult(`Based on the following design doc ${designDocPath}, \
generate new files needed by the design doc and that do not exist yet.
- Generate new test files too.
- Keep the files empty, do not write anything in them.`)
);

server.tool(
  'charted_wip',
  'Returns instructions on how to write wip code and tests based on design doc',
  {
    designDocPath,
  },
  async ({ designDocPath }) =>
    makeBasicResult(
      `Based on the following design doc ${designDocPath}, write WIP code for implementation described in the design doc.
- WIP classes, functions, and components are work-in-progress code that just throw "🚧 work in progress" errors.
- They are Wiprecated, meaning that they have the following tag in their jsdoc "@deprecated 🚧 work in progress".
- Do not implement anything additional.
- Do not break anything existing.
- Do not generate component methods unless told differently.
- For WIP tests, put the test's steps from the design doc as-is in a comment inside the body of the "it.todo" test.

# Examples

### WIP class example

\`\`\`ts
/**
 * @deprecated 🚧 work in progress
 */
class Greetings {
    hello() {
        throw new Error(\`🚧 work in progress\`)
    }
}
\`\`\`

### WIP method example

\`\`\`ts
class Greetings {
    /**
     * @deprecated 🚧 work in progress
     */
    hello() {
        throw new Error(\`🚧 work in progress\`)
    }
}
\`\`\`

### WIP component

\`\`\`ts
/**
 * @deprecated 🚧 work in progress
 */
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-rules',
    template: \`Rules - 🚧 work in progress\`
})
class Rules {
    rules = input.required<Rule[]>();
    ruleSelect = output<Rule>();
}
  \`\`\`

### WIP tests example
\`\`\`ts
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
\`\`\`
`
    )
);

server.tool(
  'charted_next_test',
  'Returns instructions on how to write the next failing test based on provided design doc and existing todo tests',
  {
    designDocPath,
    testFilePath,
  },
  async ({ designDocPath, testFilePath }) =>
    makeBasicResult(
      `Based on the design doc at ${designDocPath}, implement the body of the next todo test in ${testFilePath} without enabling it (i.e. keep "it.todo").
- Remove the step-by-step comment instructions from the test body and replace them with actual code.
- Remember that you love TDD and you want to write tests first.
- Implement the test only, do not implement the feature.

## Example

### Before

\`\`\`ts
it.todo('compute sum', () => {
  // Inject calculator
  // Call calculator.sum(1, 2)
  // Assert that the result is 3
});
\`\`\`

### After

\`\`\`ts
it.todo('compute sum', () => {
  const calculator = t.inject(Calculator);
  const result = calculator.sum(1, 2);
  expect(result).toBe(3);
});
\`\`\`

      `
    )
);

server.tool(
  'charted_green',
  'Returns instructions on how to make tests green',
  {
    designDocPath,
    testFilePath,
  },
  async ({ designDocPath, testFilePath }) =>
    makeBasicResult(`Based on the design doc at ${designDocPath}, \
enable todo tests in ${testFilePath} one by one (it.todo(...) => it(...))
and keep updating code until tests pass,
then move to the next test.

You can check tests are passing using wallaby.`)
);

server.connect(new StdioServerTransport());

function makeBasicResult(text: string): CallToolResult {
  return {
    content: [
      {
        type: 'text',
        text,
      },
    ],
  };
}
