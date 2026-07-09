# File Tests report

The report starts with a fixed top-level heading:

```md
# Tests
```

After the heading, the report starts with analysis metadata:

```md
- path: <target-file-path>
- location: line <line>, column <column>
- tests: <count>
- tests: <count>/<failed-count>
- tests: <count> (filter applied: "<test-name>" (<test-file-path>))
- tests: <count> (filter applied: "<test-name>" (<test-file-path>)) but no tests found
- lines: <line-count>
- coverage: <percent>%
- change risk anti-patterns: <number>
- size: <size>
```

Format details:

- `- path:` is always present.
- `- location:` appears when the analyze target included a resolved location.
- `- tests:` is always present. When one or more listed tests failed, the value is `<total>/<failed>`.
- A filter note appears when `--test` or `target.test` was used.
- `- lines:`, `- coverage:`, `- change risk anti-patterns:`, and `- size:` appear when Wallaby has those values for the target.
- Source-file analysis can include coverage and change-risk metrics. Test-file analysis usually includes line count and size.

When tests are present and no exact filter is applied, source-file and source-location analysis include ranked summaries:

```md
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

Test-file analysis includes the top tests by execution time, but omits the file-count summaries because every listed test belongs to the analyzed test file.

Filtered file analysis omits the ranked summaries and lists only the matching test.

The rest of the report lists tests grouped by test file:

````md
## <test-file-path>
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

This test-entry format uses the same test fields as the Failing Tests and All Tests reports, with fields shown when the formatter includes data for them.

The main analyze report may show a shorter test list:

- Source-file analysis shows all related tests, but omits test errors, logs, and covered files from the inline `Covering Tests` list. Open `file-tests.md` for the full test entries.
- Test-file analysis shows up to five tests inline and links to `file-tests.md` when additional tests are omitted.
- Filtered file analysis shows the matching test inline with full details and still links to `file-tests.md`.

If no tests are found, the report contains metadata followed by:

```md
No tests found.
```
