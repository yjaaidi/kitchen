# Failing Tests report

The report starts with a fixed top-level heading:

```md
# Failing Tests
```

The run command writes this file when the main report omits additional failing tests. After the heading, the file contains every failing test, grouped by test file:

````md
## <test-file-path>
### <test name>
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

Format details:

- `## <test-file-path>` starts a group for one test file.
- `### <test name>` is the full test name. Nested suite names are joined with ` / `.
- The formatter groups tests in the order it receives them. It does not alphabetize test-file sections or test entries.
- `- loc:` optional, uses the test file path and, when known, the declaration line number.
- `- time:` optional, uses the test execution time in milliseconds.
- Each fenced error block contains the error message or formatted assertion output for one error attached to the test.
- `Stack trace:` optional, appears after an error block when Wallaby has stack entries for that error.
- In each stack entry, the location line is always present. The context line is optional.
- Formatted assertion output may include expected, actual, or snapshot details when Wallaby can map them.
- `#### Logs` optional, shown when the test has captured logs.
- In each log entry, `- loc:` and the fenced log message block are always present. `- context:` is optional.
- `#### Covered Files` optional, lists the source files Wallaby recorded as covered by the test.

When the run command was invoked with specific test file paths, Wallaby sorts failures from those requested files first.
