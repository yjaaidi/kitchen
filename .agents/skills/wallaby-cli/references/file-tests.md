# Covering Tests and Tests reports

The `Covering Tests` link for a source file opens a report headed `# File Analysis`. The `Tests` link for a test file opens one headed `# Test File Analysis`. Both reports start with file metadata:

```md
- path: <file-path>
- tests: <count>
- lines: <line-count>
- coverage: <percent>%
- change risk anti-patterns: <number>
- size: <size>
```

`- path:` and `- tests:` are always present. The other metrics appear when available. A resolved source location adds `- location: line <line>, column <column>` after the path; the column appears only when known. When listed tests have failures, the test count is `<total>/<failed>`. A test filter adds `(filter applied: "<test-name>" (<test-file-path>))` to that line, followed by `but no tests found` if it matched no related test.

## Source-file report

A source-file report uses this shape:

```md
# File Analysis

- path: src/accounts.ts
- tests: <count>
- lines: <line-count>
- coverage: <percent>%
- change risk anti-patterns: <number>
- size: <size>

## Covering Tests

### <test name>
- status: passed|failed|skipped|todo|disabled
- loc: <test-file-path>:<line>
- time: <time>ms
```

`Covering Tests` lists all tests covering the selected source file or location, or the matching test when filtered. Entries are not grouped by test file. A failing entry can include its errors and stack traces. Source-file entries omit logs and covered-file lists.

## Test-file report

A test-file report uses this shape:

````md
# Test File Analysis

- path: tests/accounts.spec.ts
- tests: <count>
- lines: <line-count>
- size: <size>

Top 5 tests by execution time:
- <test name> (<time>ms, <test-file-path>:<line>)
- ...

## Tests

### <test name>
- status: passed|failed|skipped|todo|disabled
- loc: <test-file-path>:<line>
- time: <time>ms

```
<error message or formatted assertion output>
```
Stack trace:
- <stack-file-path>:<line>
  `<stack-context-content>`
  `<stack-context-code>`

#### Logs
- loc: <log-file>:<line>
- context: ``` <runtime context> ```
```
<log message>
```

#### Covered Files
- <covered-source-file>
- ...
````

`Tests` lists the tests belonging to the selected test file. The ranking shows up to five tests by execution time and is omitted when the report has no tests or an applied filter matched a test. Test entries include errors, stack traces, logs, and covered files when available.

If either report has no listed tests, its test section says `No tests found.` instead of showing test entries. Test names include their full suite path, joined with ` / `; location and time appear when Wallaby has those values.
