# Coverage Gaps report

The linked report starts with a fixed heading and batch counts:

```md
# Coverage Gaps

- Files analyzed: <count>
- Files with gaps: <count>
- Files with unavailable coverage: <count>
```

`Files analyzed` counts all file sections in the report. The other two counts apply to source files only. A gap is a line with `none` or `partial` coverage.

When requested paths cannot be analyzed, the report lists every path-specific error after the counts:

```md
### Files Not Analyzed

<formatted errors>
```

Each analyzed source or test file then has a `## <path>` section. Sections are ordered by coverage ascending, change risk descending, then path; files with unavailable metrics come last.

## Source-file section

A source file with coverage gaps uses this shape:

```md
## src/accounts.ts

- Coverage: <percent>%
- Change risk anti-patterns: <number>
- Covering tests: <count>

[Covering Tests](file-src@saccounts.ts.md)
[Detailed Coverage](file-src@saccounts.ts.wcov)

### Uncovered

- Lines: 43-45, 78

- Line 91: columns 12-28 `uncoveredExpression`
```

`- Lines:` lists fully uncovered lines, joining consecutive numbers into inclusive ranges. Each uncovered range on a partially covered line has its own `- Line <number>: columns <start>-<end>` entry, followed by the expression when available. If a partial line has no precise ranges, it says `uncovered expression range unavailable`.

`Uncovered` appears only when the file has gaps. A source file with no gaps says `No coverage gaps.`; one without reportable coverage says `Coverage is unavailable.` In those cases, the coverage or change-risk metric can be `unavailable`.

## Test-file section

A test file uses this shape:

```md
## tests/accounts.spec.ts

- Tests: <count>
- Failed: <count>

[Tests](file-tests@saccounts.spec.ts.md)
[Detailed Coverage](file-tests@saccounts.spec.ts.wcov)
```

Test-file sections have no `Uncovered` heading.

## Linked artifacts

- `Covering Tests` for a source file or `Tests` for a test file links to its complete related-test inventory. Read [file-tests.md](file-tests.md) for the two formats.
- `Detailed Coverage` links to a `.wcov` artifact showing the complete file with coverage annotations. It appears only when Wallaby can export coverage for that file. Read [wcov.md](wcov.md) for the format.
