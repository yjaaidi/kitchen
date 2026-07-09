---
name: charted-green
description: Progressively activates todo tests one at a time, updates implementation code until each passes (verified via Wallaby), checks off matching design doc progress, then moves to the next—following the design doc as the single source of truth.
---

# Context

- designDocPath: $ARGUMENTS[0]
- testFilePath: $ARGUMENTS[1]

# Goal

Using the design doc at `${designDocPath}` as the single source of truth, progressively activate the tests in `${testFilePath}`.

# Steps

1. Categorize each test in `${testFilePath}` as:

- Implemented tests: tests that contain actual test code (not just empty or comments)
- Empty tests: tests that are empty or only contain comments - TOTALLY IGNORE THESE

2. For each implemented test, convert `it.todo(...)` into `it(...)`, but do it strictly one test at a time, then update the implementation just enough for that specific test to turn green — NOTHING MORE.

DO NOT IMPLEMENT ANYTHING THAT IS NOT DIRECTLY RELATED TO THE CURRENT TEST.

3. After the current test passes, update progress in `${designDocPath}` (see [Design Doc Progress](#design-doc-progress) below).

4. STOP when these tests are green.

5. Remove the wiprecation (@deprecated 🚧 work in progress) jsdoc from the implementated item if it is done and safe to use.

# Design Doc Progress

After each test turns green, update `${designDocPath}` to reflect completed work.

Flip `🚧` to `✅` and `- [ ]` to `- [x]`. Do not edit any other text, headings, diagrams, or structure in the design doc.

Check off items in these sections only:

1. **PR's Testing Strategy** — the `### 🚧 {test_title}` heading that matches the test you just activated.
2. **PR's Tasks** — every `- [ ] ...taslk description...` item whose work is now done and verified by the passing test.
3. **PR Plan** — the `## 🚧 {pr_title}` entry when all PR's Tasks and Testing Strategy items are checked off.

If you are unsure whether an Implementation Details item is done, leave it unchecked.

# Rules

DO NOT IMPLEMENT EMPTY TESTS.

NEVER implement tests.

ONLY EDIT TESTS as a last resort after you have tried everything else.

**Design doc edits are only checkbox-based or `🚧` to `✅` replacements.** Never reword, reorder, add, or remove content in `${designDocPath}`.

Run tests after each change. Only once the current test passes should you advance to the next one.

Use the Wallaby Skill if available to run tests, otherwise run tests using the recommended approach for the project.
