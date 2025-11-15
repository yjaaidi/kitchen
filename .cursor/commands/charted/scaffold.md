---
description: Scaffold files based on design doc
---

# Context

- designDocPath: $ARGUMENTS[0]

# Task

Based on the following design doc ${designDocPath}, generate new files needed by the design doc and that do not exist yet.

- Generate new test files too.
- Keep the files empty, do not write anything in them.
