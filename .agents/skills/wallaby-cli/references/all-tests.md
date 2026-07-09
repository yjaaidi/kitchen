# All Tests report

The report starts with a fixed top-level heading:

```md
# All Tests
```

After the heading, the file has four parts in this order:

1. `Top 5 tests by execution time`
2. `Top 5 files by execution time`
3. `Top 5 files by test count`
4. Every test, grouped by test file

The opening summary uses this shape:

```md
# All Tests

Top 5 tests by execution time:
- <test name> (<time>ms, <test-file-path>:<line>)
- ...

Top 5 files by execution time:
- <test-file-path> (<total-time>ms, <test-count> tests)
- ...

Top 5 files by test count:
- <test-file-path> (<test-count> tests, <total-time>ms)
- ...
```

The ranked sections currently show up to five entries each. These labels are plain text lines, not Markdown headings. Test times and file totals are rendered in milliseconds with trailing zeros trimmed. The first list ranks individual tests by descending execution time. The next two lists rank test files by total execution time and by number of tests.

The rest of the file is the full inventory, grouped like this:

````md
## <test-file-path>
### <test name>
- status: passed|failed|skipped|todo|disabled
- loc: <test-file-path>:<line>
- time: <time>ms

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

Format details:

- `## <test-file-path>` starts a group for one test file.
- `### <test name>` is the full test name. Nested suite names are joined with ` / `.
- The formatter groups tests in the order it receives them. It does not alphabetize test-file sections or test entries.
- `- status:` is always present in `all-tests.md` and is one of `passed`, `failed`, `skipped`, `todo`, or `disabled`.
- `- loc:` optional, uses the test file path and, when known, the declaration line number.
- `- time:` optional, uses the test execution time in milliseconds.
- `#### Logs` optional, shown when the test has captured logs.
- In each log entry, `- loc:` and the fenced log message block are always present. `- context:` is optional.
- `#### Covered Files` optional, lists the source files Wallaby recorded as covered by the test.

Important differences from `failing-tests.md`:

- `all-tests.md` includes passed, failed, skipped, todo, and disabled tests.
- Failed tests still show `- status: failed`, but this report omits inline assertion details, error messages, expected/actual values, snapshots, and stack traces.
- Read `failing-tests.md` or use the main report when failure diagnostics are needed instead of inventory.
