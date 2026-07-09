# `.wcov` coverage artifact

The `.wcov` artifact is a coverage-oriented pseudo-code view of one file. It preserves source lines and appends comments with line numbers, coverage state, and uncovered column ranges with source expressions for partially covered lines, so agents can inspect exactly which code was covered.

Example:

```ts
import { round } from './math'; /* line: 1; coverage: full */
/* line: 2 */
const factor = 9 / 5; /* line: 3; coverage: full */
/* line: 4 */
export function celsiusToFahrenheit(celsius: number): number { /* line: 5 */
  return celsius <= -273.15 ? NaN : round(celsius * factor + 32); /* line: 6; coverage: partial [36-63: round(celsius * factor + 32)] */
}
```

Format details:

- The file name is derived from the relative file path by replacing path separators with `-` and appending `.wcov`. For example, `src/temperature.ts` becomes `src-temperature.ts.wcov`.
- The artifact contains the file content with a pseudo-block comment after every output line.
- Every output line has a `line: <number>` annotation in a pseudo-block comment.
- Coverable lines also include `coverage: full`, `coverage: partial`, or `coverage: none`.
- `coverage: full` means every coverable range on the line was executed.
- `coverage: partial` means some coverable ranges on the line were executed and some were not.
- `coverage: none` means no coverable ranges on the line were executed.
- Partially covered lines can include one or more uncovered column ranges and source expressions in brackets.
- Each uncovered range uses zero-based inclusive columns and the shape `<start>-<end>: <trimmed source expression>`.
- Multiple uncovered ranges on the same line are separated with ` | `.
- Non-coverable lines have only the line annotation. Blank lines are emitted as standalone annotation comments.
- The comment syntax follows the target file type. JavaScript and TypeScript use `/* ... */`; other file types use their own supported comment syntax when available.
- When `--test` filters file analysis, coverage annotations and metrics are calculated for the selected test only. Uncovered lines that other tests cover can therefore appear as `coverage: none` in the filtered `.wcov` artifact.
- `.wcov` content is not intended to be compiled or copied back into source files.
