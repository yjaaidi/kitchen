# Test Execution Trace

The Test Execution Trace shows the source lines Wallaby recorded while the selected test ran. It presents those lines in execution order across files, with the selected test's first line marked inline.

The report starts with a fixed top-level heading:

```md
# Test Execution Trace
```

If Wallaby truncated the trace, the heading is followed by a note:

```md
Note: this Test Execution Trace is truncated at the start.
Note: this Test Execution Trace is truncated at the end.
Note: this Test Execution Trace is truncated at the start and at the end.
```

When trace entries are available, the report contains one section per file entry:

````md
## <file-path>

```
<line-number> <source-line>
<line-number> <source-line> /* test starts here */
```
````

Format details:

- `## <file-path>` appears when Wallaby associates the trace entry with a file.
- Code fences are plain fenced blocks with no language tag.
- Line numbers are original source line numbers, padded to align within the trace.
- `<source-line>` is the source code line from the original file.
- The selected test start is marked inline with `test starts here` using the target file's comment syntax.
- The same file can appear in multiple sections when the execution trace returns to that file.

If no trace entries are available, the report says:

```md
No test execution trace captured.
```
