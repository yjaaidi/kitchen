# Self heal

Skills (read and follow):

- `.agents/skills/angular`
- `.agents/skills/angular-testing`

## Context

The **Test** workflow failed on the branch given in the dispatcher payload. Use the dispatcher `message` for the failed Actions run URL, run id, and head SHA when present.

## Investigation

1. Inspect the failed run with `gh run view` and failed job logs (`gh run view --log-failed`).
2. Identify the root cause; prefer minimal, targeted fixes.

## Repair

1. Apply code fixes following the Angular and testing skills.
2. Run `pnpm test` and ensure tests pass.
3. If the failure is environmental, flaky, or not fixable in-repo, stop with a short explanation and do not publish code changes.

## Publish

Work on the payload `branch` only.

1. Commit with a clear message; suffix or prefix with `refactor: 🛠️ self-heal` when appropriate.
2. If an open pull request exists for that branch, push to it.
3. Otherwise open a pull request from that branch with title prefix `refactor: 🛠️ self-heal` and a short summary.

Do not mask test failures or weaken assertions to make CI green.
