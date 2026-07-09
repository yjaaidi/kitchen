# Global Errors report

The report starts with a fixed top-level heading:

```md
# Global Errors
```

After the heading, the file contains one numbered section per global error:

````md
## Error 1

```
<error message or formatted error output>
```
Stack trace:
- <stack-file-path>:<line>
  `<stack-context-content>`
  `<stack-context-code>`

## Error 2
...
````

Format details:

- `## Error <number>` starts one global error entry. Entries are numbered in export order.
- Each fenced error block contains the error message or formatted error output for one global error.
- `Stack trace:` optional, appears after an error block when Wallaby has stack entries for that error.
- In each stack entry, the location line is always present. If Wallaby has no location, the line is `- Unknown location`.
- In each stack entry, the indented context lines are optional.
- Formatted error output may include expected, actual, or snapshot details when Wallaby can map them.

The main report shows only the first few global errors. Open `global-errors.md` when the main report says more global errors were omitted.
