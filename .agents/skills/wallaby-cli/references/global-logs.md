# Global Logs report

The report starts with a fixed top-level heading:

```md
# Global Logs
```

After the heading, the file contains one numbered section per global log entry:

````md
## Log 1

- loc: <file-path>:<line>
- context: ``` <runtime context> ```
```
<log message>
```

## Log 2
...
````

Format details:

- `## Log <number>` starts one global log entry. Entries are numbered in export order.
- `- loc:` optional, uses the log file path and, when known, the line number.
- `- context:` optional, shows the runtime context Wallaby attached to the log.
- The fenced log message block is optional and contains the logged text.

Use global logs to understand setup output, background process output, or diagnostic logging emitted outside an individual test body.
