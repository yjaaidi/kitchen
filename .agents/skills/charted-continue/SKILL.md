---
name: charted-continue
description: Continues Charted Coding work for a PR by routing to scaffold, red, or green based on design doc progress. Use when resuming work on a PR, continuing TDD after a break, or when the user invokes charted continue with a design doc and PR number.
---

# Context

- designDocPath: $ARGUMENTS[0]
- prNumber: $ARGUMENTS[1]

# Goal

Read `${designDocPath}`, inspect the state of PR #${prNumber}, and invoke exactly one downstream skill:

| Condition                        | Skill to invoke    |
| -------------------------------- | ------------------ |
| Scaffolding not done             | `charted-scaffold` |
| Next 🚧 test not implemented     | `charted-red`      |
| Next 🚧 test already implemented | `charted-green`    |

# Steps

## 1. Locate the PR section

In `${designDocPath}`, find the section for PR #${prNumber} — a heading like `# 🚧 PR#N - {title}` or `# PR#N - {title}`.

Read its **Tasks** and **Testing Strategy** subsections. The design doc is the single source of truth for what belongs to this PR.

## 2. Check scaffolding

Scaffolding is **done** when all of the following hold for PR #${prNumber}:

- Test file(s) exist for the PR's Testing Strategy scenarios.
- Each `### 🚧 {test_title}` scenario has a matching `it.todo("{test_title}", ...)` in a test file (test names are lower case).
- WIP production files referenced in Tasks exist (classes/components tagged `@deprecated 🚧 work in progress` or equivalent stubs).

Scaffolding is **not done** if any expected test file or WIP source file is missing, or if `it.todo` stubs with design-doc step comments do not yet exist.

**If scaffolding is not done** → read and follow the `charted-scaffold` skill with `${designDocPath}` and `${prNumber}`. **Stop.**

## 3. Find the next pending test

In the PR's **Testing Strategy**, pick the **first** heading still marked `### 🚧 {test_title}` (not `### ✅`).

If every test is `### ✅`, report that PR #${prNumber} is complete and **stop**.

## 4. Locate the matching test file

Search the project for the `it.todo` whose name matches the pending test title (case-insensitive). Prefer the file under the component or unit named in the nearest `## {Component}` heading above the scenario.

Record the path as `testFilePath`.

## 5. Classify the test

Open `testFilePath` and inspect the `it.todo` body for the pending test:

- **Not implemented** — body is empty or contains only step-by-step comments copied from the design doc (no `expect`, `inject`, mount helpers, or other executable test code).
- **Implemented** — body contains actual test code beyond comments.

## 6. Invoke the downstream skill

**Not implemented** → read and follow the `charted-red` skill with `${designDocPath}` and `${testFilePath}`.

**Implemented** → read and follow the `charted-green` skill with `${designDocPath}` and `${testFilePath}`.

# Rules

- Invoke **one** downstream skill per run — never scaffold, red, and green in the same turn.
- Do not skip ahead to a later 🚧 test while an earlier one is still pending.
- Do not implement production code or enable tests directly — delegate to the downstream skill.
- When reading downstream skills, follow their instructions fully, including Wallaby usage and design-doc checkbox updates.
