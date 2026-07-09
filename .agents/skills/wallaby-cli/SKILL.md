---
name: wallaby-cli
description: Run project tests, check test status, and debug failing tests using Wallaby.js real-time test results. Use after making code changes to verify tests pass, when checking if tests are failing, debugging test errors, analyzing assertions, inspecting runtime values/logs, checking test coverage, updating snapshots, or when the user mentions Wallaby, tests, coverage, or test status.
compatibility: Requires Node.js
metadata:
  author: Wallaby.js
  version: "2.1"
---

# Wallaby CLI Skill

Wallaby.js runs JavaScript and TypeScript tests and provides real-time results. This skill uses the Wallaby CLI to run tests, check test status, and debug failing tests. It generates detailed Markdown reports with test results, errors, logs, and coverage information.

## When to Use

- **After code changes** - Verify tests pass after modifications
- **Checking test status** - See if any tests are failing
- **Debugging failures** - Analyze test errors and exceptions
- **Inspecting runtime values** - Examine variable states during tests
- **Understanding coverage** - See which code paths tests execute
- **Updating snapshots** - When snapshot changes are needed
- User mentions "tests", "test status", "run tests", or "Wallaby"

## Commands

If `@wallabyjs/cli` is installed as a project dependency, invoke the `wallaby-skill` binary through the project's package manager:

- `npx wallaby-skill ...`
- `pnpm exec wallaby-skill ...`
- `yarn exec wallaby-skill ...`
- `bun run wallaby-skill ...`

If `@wallabyjs/cli` is installed globally and `wallaby-skill` is available on `PATH`, call it directly:

- `wallaby-skill ...`

If the package is not installed, choose the auto-install command for the project's package manager. These commands invoke the `wallaby-skill` binary, require network access, and download the package from the npm registry:

- `npx -y --package @wallabyjs/cli wallaby-skill ...`
- `pnpm dlx --package=@wallabyjs/cli wallaby-skill ...`
- `yarn dlx -p @wallabyjs/cli wallaby-skill ...`
- `bunx --package @wallabyjs/cli wallaby-skill ...`

The examples below show how to use the Wallaby CLI with `npx wallaby-skill` before each Wallaby subcommand, such as `run`, `inspect`, `analyze`, or `stop`. In a real project, use the matching command form for the project's package manager from the lists above.

### Run command

Use `npx wallaby-skill run` as the default command for project-wide test verification. Prefer this command to `npm test` commands that call `vitest`, `jest`, `ng test`, etc., and run those only if the user specifically asks for them. With no test file paths, the command reports the project-wide test state. On first use, it starts a Wallaby instance and keeps it running after the command finishes. Wallaby then continues running tests in the background as files change, so follow-up runs are faster because results are already cached.

The command also accepts specific test file paths as arguments: `npx wallaby-skill run ./src/feature-a.spec.ts ./src/feature-b.spec.ts`. If Wallaby is already running in project mode, calling the command with specific test file paths still reports project-wide results, but it prioritizes failures from the requested files. If Wallaby is not running, the command starts a new instance in exclusive mode, meaning Wallaby runs and reports only the specified test files. To add more test files to an active exclusive instance, run the command again with those paths. To return to project mode and run the full project, run the command again without test file paths.

Use `--config` to point to a specific project Wallaby config file. Use `--rerun` only when test results depend on an external file or state that Wallaby does not watch, such as a database update or generated file outside the project's file set.

```sh
npx wallaby-skill run # runs all project tests if needed and reports project-wide test results
npx wallaby-skill run --config ./wallaby.js # runs all project tests if needed and reports project-wide test results using the specified config file
npx wallaby-skill run ./src/feature-a.spec.ts ./src/feature-b.spec.ts # runs the specified test files
npx wallaby-skill run ./src/feature-a.spec.ts --test "feature-a / should match the expected value" # runs the specified test in the specified file
npx wallaby-skill run --snapshots ./src/feature-a.spec.ts ./src/feature-b.spec.ts # updates snapshots for the specified test files, or for all tests if no files are given
npx wallaby-skill run --snapshots ./src/feature-a.spec.ts --test "feature-a / should match the expected snapshots" # updates snapshots for the named test in the specified file
npx wallaby-skill run --update # updates Wallaby to the latest version, then runs all project tests and reports project-wide test results; use when the CLI reports compatibility errors
npx wallaby-skill run --help # shows help for the run command
```

The command prints a Markdown report like this; a non-zero exit code usually means the report contains failing tests or errors, though it may also mean the CLI or Wallaby itself failed:

- `Status: succeeded` or `Status: failed`
- `Mode: project` when the report reflects the whole project, or `Mode: exclusive` when Wallaby is limited to selected test files or test locations
- `Note: Wallaby is running tests only from specific test locations:` followed by the active test locations, shown after `Mode: exclusive` and before `Summary`
- `Summary` with total, passed, failed, skipped, todo, and coverage percentage
- `Fatal Error` when Wallaby reports a run-level error instead of an individual test failure; this can happen before tests start, for example when file processing fails. It shows the fatal error message
- `Global Errors` when Wallaby reports errors not tied to a single test; it shows the first few global error messages and stack traces inline and links to the full global-errors report when there are more. Read `references/global-errors.md` when you need the full global-errors report format.
- `Failing Tests` when one or more tests fail; it shows the most important failing test names, locations, execution times, error messages, expected/actual or snapshot values, logs, covered files, and stack traces inline, and links to the full failing-tests report when additional failing tests are omitted. Read `references/failing-tests.md` when you need the full failing-tests report format.
- `All Tests` shows the full test inventory; it starts with top tests by execution time plus top files by execution time and test count, then groups tests by test file and shows test names, statuses, locations, timings, logs, and covered files. Read `references/all-tests.md` when you need the full all-tests report format.
- `Coverage` starts with the top files by change risk anti-patterns and metric definitions, then shows one section per covered source file with its coverage percentage, cyclomatic complexity, change risk, and a `Covered by` list of the test files that cover it. Read `references/coverage.md` when you need the full coverage report format.
- `Global Logs` when Wallaby captures logs not tied to a single test; it shows log locations, runtime context, and logged messages. Read `references/global-logs.md` when you need the full global-logs report format.

Generated `All Tests`, `Coverage`, and `Failing Tests` reports can be large. For specific results in generated reports, prefer `grep` over reading the whole file. For example, to find all tests that mention `estimates sleet near freezing`:

```sh
grep -Pzo '(?sm)^### [^\n]*estimates sleet near freezing[^\n]*\n.*?(?=^### |^## |\z)' all-tests.md | tr '\0' '\n'
```

To find all tests in `tests/temperature.spec.ts`:

```sh
grep -Pzo '(?sm)^## tests/temperature\.spec\.ts[^\n]*\n.*?(?=^## |\z)' all-tests.md | tr '\0' '\n'
```

To find the coverage entry for `src/temperature.ts`:

```sh
grep -Pzo '(?sm)^## src/temperature\.ts[^\n]*\n.*?(?=^## |\z)' coverage.md | tr '\0' '\n'
```

### Inspect command

Use `inspect` to inspect a variable or expression at runtime. It is useful for debugging test errors, analyzing assertions, and understanding test behavior. The command evaluates the expression in every test execution context that reaches the selected source location, so one expression can produce many runtime values. Prefer using the command instead of adding manual `console.log` statements because it is more efficient.

The command only works when Wallaby is already running for the same project and config. Start it first with `npx wallaby-skill run`, then use `inspect` for follow-up debugging. If `--config` was provided for `run`, it must also be provided for `inspect`.

Pass one or more inspection targets, each with a file path, a source location, and an expression. Multiple inspection targets can be included in the same command by passing additional inspection targets as separate arguments. The source location can be a code fragment, a line number, or a line and column. For example, to inspect the value of the `alerts` variable in `src/alerts.ts`:

```sh
npx wallaby-skill inspect "{path:'src/alerts.ts',location:{fragment:'const alerts: WeatherAlert[] = [];'},expression:'alerts'}" "{path:'src/alerts.ts',location:{line:134},expression:'alerts'}"
```

With fragment-based locations, the fragment acts as both file-search criteria and the containing snippet used to locate the expression inside the file. Fragment-based locations are often a better fit for LLM/code agents because no line-number calculation is required.

A base64-encoded `fragment` avoids escaping special characters and newlines in multi-line fragments. The CLI decodes the fragment before searching the file:

```sh
npx wallaby-skill inspect "{path:'src/alerts.ts',location:{fragment:'Ly8gdW5pcXVlIGNvZGUgZnJhZ21lbnQKY29uc3QgYWxlcnRzOiBXZWF0aGVyQWxlcnRbXSA9IFtdOw=='},expression:'alerts'}"
```

If the line number is known, use it instead of a fragment:

```sh
npx wallaby-skill inspect "{path:'src/alerts.ts',location:{line:134},expression:'alerts'}"
```

If several occurrences of the expression are near the same line, add a column number to pick the closest match:

```sh
npx wallaby-skill inspect "{path:'src/alerts.ts',location:{line:134,column:10},expression:'alerts'}"
```

To show only values produced by tests with a matching name in the main report, pass `--test` with the full or partial test name:

```sh
npx wallaby-skill inspect "{path:'src/alerts.ts',location:{line:134},expression:'alerts'}" --test "alerts output / combined conditions"
```

To clear all previously captured runtime values, pass `--clear`:

```sh
npx wallaby-skill inspect "{path:'src/alerts.ts',location:{line:134},expression:'alerts'}" --clear # clears all captured runtime values and adds new inspection
npx wallaby-skill inspect --clear # clears all captured runtime values
```

When `--clear` is used without inspection targets, the command prints `Cleared all captured runtime values.` instead of a Markdown report.

Otherwise, the command prints a Markdown report like this; a non-zero exit code usually means the report contains failing tests or errors, though it may also mean the CLI or Wallaby itself failed:

- `Status`, `Mode`, `Summary`, `Fatal Error`, and `Global Errors` sections are the same as in the run command report
- `Runtime Values` shows captured values inline with the source file, line, expression, formatted value, and test that produced each value; if requested inspections could not be captured, it also shows warnings with the path, expression, location, and reason; if additional values are omitted, it links to the full runtime-values report. Read `references/runtime-values.md` when you need the full runtime-values report format.
- When `--test` is used, the main report filters runtime values by test name and links to the full unfiltered report when other values are available; uncaptured-inspection warnings are still shown because they describe requested inspection locations, not captured values from a specific test

Generated `Runtime Values` reports can be large. For specific results, prefer `grep` over reading the whole file. For example, to find all captured values for `src/alerts.ts`:

```sh
grep -Pzo '(?sm)^## src/alerts\.ts[^\n]*\n.*?(?=^## |\z)' runtime-values.md | tr '\0' '\n'
```

To find all runtime values produced by tests whose names mention `combined conditions`:

```sh
grep -Pzo '(?sm)^## [^\n]*\n.*?^- name: .*combined conditions.*\n.*?(?=^## |\z)' runtime-values.md | tr '\0' '\n'
```

### Analyze command

Use `analyze` when a run report points to a test or file that needs deeper investigation. The command reads Wallaby's current results and full coverage information, then prints a Markdown report for one of two analysis types: test analysis for one executed test, or file analysis for a whole source file, a whole test file, or a specific source-file location.

The command only works when Wallaby is already running for the same project and config. Start it first with `npx wallaby-skill run`, then use `analyze` for follow-up debugging. If `--config` was provided for `run`, it must also be provided for `analyze`.

If `analyze` cannot resolve the requested target, the command exits with a non-zero code and prints an error message instead of a report. This includes invalid paths, missing files, a test target path that is not a test file, a missing test name, or a source file location that cannot be resolved.

#### Test Analysis

Use `--target test` to analyze one executed test. Pass a target object with the test file path and test name:

```sh
npx wallaby-skill analyze --target="test" "{path:'tests/temperature.spec.ts',name:'celsiusToFahrenheit / converts boiling point'}"
```

Test analysis explains one test's execution. The main report includes:

- `Status`, `Mode`, `Summary`, `Fatal Error`, and `Global Errors` sections are the same as in the run command report
- `Test Analysis` with the selected test's name, status, location, execution time, errors, logs, covered files, and `Test Execution Trace`. The trace is a single logical view of the code the test executes, with source lines shown in execution order, file names, and line numbers. Its `test starts here` comment marks the first line of code in the selected test, after imports and other setup code that runs before the test. Read `references/test-trace.md` when you need the full test-trace format.
- `Covered Files` links to per-file `.wcov` coverage artifacts for source files covered by the selected test. Each artifact contains the file content with pseudo-block comments after every source line. The comments annotate line numbers and line-level coverage (covered, partially covered, or uncovered). Partially covered lines can include uncovered column ranges with the corresponding source expressions. Read `references/wcov.md` when you need the full `.wcov` artifact format.

Generated `Test Execution Trace` artifacts can be large. Prefer targeted search instead of reading the full artifact. For example, to find the selected test start:

```sh
grep -n -B 20 -A 5 'test starts here' test-trace.md
```

#### File Analysis

Use `--target file` to analyze one file. Pass a target object with the file path. Add `--test` when you need coverage and test details filtered to one exact test.

Add a `location` when you need tests that cover a specific line or a specific line and column. If you know the line and expression but not the column, pass `line` and `expression`; Wallaby resolves the column. If you know a source fragment and expression, pass `fragment` and `expression`; Wallaby resolves the line and column. A base64-encoded `fragment` avoids escaping special characters and newlines in multi-line fragments. The CLI decodes the fragment before searching the file.

```sh
npx wallaby-skill analyze --target="file" "{path:'src/temperature.ts'}" # analyzes the whole source file with no location
npx wallaby-skill analyze --target="file" "{path:'src/temperature.ts'}" --test "{path:'tests/temperature.spec.ts',name:'celsiusToFahrenheit / converts boiling point'}" # analyzes the whole source file with no location and filters to the exact test
npx wallaby-skill analyze --target="file" "{path:'src/temperature.ts',location:{line:10}}" # analyzes the specified location in the source file by line number
npx wallaby-skill analyze --target="file" "{path:'src/temperature.ts',location:{line:10,expression:'celsius'}}" # analyzes the specified location in the source file by line number, using the expression to resolve the column
npx wallaby-skill analyze --target="file" "{path:'src/temperature.ts',location:{line:10,column:10}}" # analyzes the specified location in the source file by line and column numbers
npx wallaby-skill analyze --target="file" "{path:'src/temperature.ts',location:{fragment:'return (celsius * 9) / 5 + 32;',expression:'celsius'}}" # analyzes the specified location in the source file by fragment search, using the expression to resolve the line and column in the first fragment match
npx wallaby-skill analyze --target="file" "{path:'src/temperature.ts',location:{fragment:'cmV0dXJuIChjZWxzaXVzICogOSkgLyA1ICsgMzI7',expression:'celsius'}}" # analyzes the specified location in the source file by base64-encoded fragment search, using the expression to resolve the line and column in the first fragment match
```

File analysis explains the tests related to one source or test file, or to a specific source file location. The main report includes:

- `File Analysis` for a source file, or `Test File Analysis` for a test file
- file metadata and analysis metrics such as path, location, test count, line count, coverage, change risk anti-patterns, and size when available, plus `Detailed File Coverage` linked to a `.wcov` artifact. The artifact contains the file content with pseudo-block comments after every source line. The comments annotate line numbers and line-level coverage (covered, partially covered, or uncovered). Partially covered lines can include uncovered column ranges with the corresponding source expressions. Read `references/wcov.md` when you need the full `.wcov` artifact format.
- `Covering Tests` for source files, or `Tests` for test files, with test names, statuses, locations, and execution times. Failed tests also show error messages and stack traces. Test-file analysis can show logs and covered files for each test.
- `File Tests` contains the full external test report. `File Analysis` always links it because the main report's `Covering Tests` section does not include test errors or logs. `Test File Analysis` links it when the main report omits additional tests. Read `references/file-tests.md` when you need the full file-tests report format.

Generated `File Tests` and `.wcov` artifacts can be large. Prefer targeted search instead of reading a full artifact. For example, to find a test in `file-tests.md`:

```sh
grep -Pzo '(?sm)^### [^\n]*generates severe heat alert[^\n]*\n.*?(?=^### |^## |\z)' file-tests.md | tr '\0' '\n'
```

To find partially covered lines in a `.wcov` file:

```sh
grep -n 'coverage: partial' src-alerts.ts.wcov
```

To find a source line in a `.wcov` file:

```sh
grep -n 'alerts.push({' src-alerts.ts.wcov
```

### Stop command

Wallaby usually stops automatically when the agent session ends, so agents normally do not need to stop it manually. Use `stop` only when the user asks for it or when it is necessary, for example to restart Wallaby cleanly with a different config or to release the running instance immediately.

```sh
npx wallaby-skill stop
npx wallaby-skill stop --config ./wallaby.js # if `--config` was provided for `run`, it must also be provided for `stop`.
```
