# Runtime Values report

The report starts with a fixed top-level heading:

```md
# Runtime Values
```

After the heading, the file may start with uncaptured-inspection warnings, then contains one section per captured runtime value:

````md
Wallaby could not capture runtime values for the locations listed below:

- path: `<source-file-path>`; expression: `<expression>`; location: <location>; reason: <reason>

## <source-file-path>
- line: <line>
- expression: `<expression>`
```
<formatted runtime value>
```
### Test
- name: <test name>
- file: <test-file-path>

## <source-file-path>
...
````

Format details:

- The uncaptured-inspection warning block is optional. It appears when `inspect` was asked to evaluate an expression but Wallaby could not capture a runtime value for that requested location.
- Warning entries use this shape: `- path: <inline-code-path>; expression: <inline-code-expression>; location: <location>; reason: <reason>`.
- Warning locations are formatted as `fragment: <inline-code-fragment>`, `line <line>, column <column>`, or `line <line>`, matching the location object passed to the inspect command.
- Warning reasons can include path normalization failure, missing file, missing file content, expression not found, expression evaluation failure, missing covered file, missing line, missing covered ranges, or no matching runtime value in the logs.
- `## <source-file-path>` starts one runtime value entry. The same source file can appear many times when multiple tests or multiple executions reach the inspected location.
- `- line:` is the source line where Wallaby evaluated the expression.
- `- expression:` is the inspected expression.
- The fenced block contains Wallaby's formatted runtime value. Values can be primitives, arrays, objects, `undefined`, thrown evaluation output, or any other display text Wallaby captures for the expression.
- `### Test` appears when Wallaby can associate the value with a test.
- `- name:` is the full test name. Nested suite names are joined with ` / `.
- `- file:` is the test file that produced the value.
- Entries are written in the order Wallaby exports them. The formatter does not group, deduplicate, or sort them.

The main inspect report may omit some matching runtime values. Open `runtime-values.md` when the main report says more runtime values were omitted.

When the inspect command uses `--test`, the main report filters runtime values by test name. This file still contains all captured values, not only the values matching the filter.

If no runtime values were captured but Wallaby has warnings for the requested inspection locations, `runtime-values.md` is still written. The main inspect report may show the same warning block without linking to the file. The file then says:

```md
No runtime values captured.
```
