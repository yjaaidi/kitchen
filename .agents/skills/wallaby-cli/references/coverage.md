# Coverage report

The report starts with a fixed top-level heading:

```md
# Coverage
```

Each report starts with the shared coverage summary:

```md
Top 5 files by change risk anti-patterns:
- <source-file-path> (Change Risk Anti-Patterns: <number>, Coverage: <percent>%)
- ...

Metric guide:
- Coverage: percentage of coverable code ranges covered by tests.
- Cyclomatic Complexity: sum of per-function cyclomatic complexity values in the file, counting each function once.
- Change Risk Anti-Patterns: CRAP = C^2 * (1 - P / 100)^3 + C, rounded to one decimal, where C is Cyclomatic Complexity and P is file Coverage percentage. Higher values indicate riskier files to change.
```

The file then lists covered source files:

```md
## <source-file-path>

- Coverage: <percent>%
- Cyclomatic Complexity: <number>
- Change Risk Anti-Patterns: <number>
- Covered by:
  - <test-file-path>
  - ...
```

Format details:

- The top change-risk list is optional. It appears only when at least one covered file has change-risk data.
- The top change-risk list is plain text under `# Coverage`, not a heading.
- The top change-risk list shows up to five files, sorted by change risk descending. Ties are sorted by coverage ascending, then file path.
- Each top change-risk entry includes the source file path, change risk, and coverage percentage.
- `## <source-file-path>` starts one covered source-file entry.
- Source-file entries are sorted from lowest coverage to highest coverage. Ties are sorted by file path.
- `- Coverage:` is always present, uses the source-file coverage percentage.
- `- Cyclomatic Complexity:` is present when Wallaby has function complexity data for the source file.
- `- Change Risk Anti-Patterns:` is present when Wallaby has enough data to calculate it from Cyclomatic Complexity and Coverage.
- `- Covered by:` is always present, followed by an indented bullet list of test file paths covering the source file.
- The formatter preserves the collected order of the `Covered by` test file list. It does not alphabetize it.

Do not treat coverage from an exclusive run as whole-project coverage. The main report, not `coverage.md`, shows whether Wallaby is running only specific test locations.
