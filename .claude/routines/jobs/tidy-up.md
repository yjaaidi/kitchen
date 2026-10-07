# Tidy up

Skills (read and follow):

- `.agents/skills/angular`
- `.agents/skills/angular-testing`

## Context

This branch added one or more `// TIDYUP` markers compared to base branch `charted-coding-1-design-doc` (unless the dispatcher `message` names a different base). Complete the deferred cleanup each marker describes, then remove every `// TIDYUP` comment.

## Steps

1. Find all `// TIDYUP` comments introduced on this branch (diff against the base branch).
2. Apply each cleanup.
3. If there are no file changes after cleanup, stop without opening a PR or pushing.

## Publish

Work on the payload `branch` only.

1. Commit with a clear message; suffix or prefix with `refactor: 🛠️ tidy up` when appropriate.
2. If an open pull request exists for that branch, push to it.
3. Otherwise open a pull request from that branch with title prefix `refactor: 🛠️ tidy up` and a short summary of what was tidied.

Do not leave `// TIDYUP` markers in the tree when you finish.
