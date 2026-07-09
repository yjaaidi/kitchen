const DESIGN_DOCS_PREFIX = 'design-docs/';
const SPEC_FILE_PATTERN = /\.spec\.tsx?$/;
const WORK_IN_PROGRESS_PATTERN = /work in progress/i;
const SCAFFOLD_WIP_RATIO_THRESHOLD = 0.1;

interface File {
  path: string;
  diff: string;
}

interface Commit {
  files: File[];
}

export default {
  base: 'charted-coding-0-starter',
  processCommit: (commit: Commit) => {
    const changedFiles = commit.files;
    if (changedFiles.length === 0) {
      return { tags: [] };
    }

    const tags: string[] = [];

    if (hasDesignDocOnlyChanges(changedFiles)) {
      tags.push('design');
    }

    if (
      changedFiles.length === 1 &&
      SPEC_FILE_PATTERN.test(changedFiles[0]?.path ?? '')
    ) {
      tags.push('test');
    }

    if (hasScaffoldChanges(changedFiles)) {
      tags.push('scaffold');
    }

    return { tags };
  },
};

function hasDesignDocOnlyChanges(files: File[]) {
  if (files.length === 0) {
    return false;
  }

  if (!files.every((file) => file.path.startsWith(DESIGN_DOCS_PREFIX))) {
    return false;
  }

  return files.some((file) => hasNonStatusOnlyDiff(file.diff));
}

function hasNonStatusOnlyDiff(diff: string) {
  const removedLines: string[] = [];
  const addedLines: string[] = [];

  for (const line of diff.split('\n')) {
    if (
      line.startsWith('---') ||
      line.startsWith('+++') ||
      line.startsWith('@@')
    ) {
      continue;
    }

    if (line.startsWith('-')) {
      removedLines.push(line.slice(1));
    } else if (line.startsWith('+')) {
      addedLines.push(line.slice(1));
    }
  }

  const matchedAddedIndexes = new Set<number>();

  for (const removedLine of removedLines) {
    const matchIndex = addedLines.findIndex(
      (addedLine, index) =>
        !matchedAddedIndexes.has(index) &&
        isDesignDocStatusOnlyChange(removedLine, addedLine),
    );

    if (matchIndex >= 0) {
      matchedAddedIndexes.add(matchIndex);
    } else {
      return true;
    }
  }

  for (let index = 0; index < addedLines.length; index++) {
    if (!matchedAddedIndexes.has(index)) {
      return true;
    }
  }

  return false;
}

function isDesignDocStatusOnlyChange(oldLine: string, newLine: string) {
  return (
    normalizeDesignDocStatus(oldLine) === normalizeDesignDocStatus(newLine)
  );
}

function normalizeDesignDocStatus(line: string) {
  return line
    .replace(/\[ \]|\[x\]|\[X\]/g, '[STATUS]')
    .replace(/🚧|✅/g, 'STATUS_EMOJI');
}

function hasScaffoldChanges(files: File[]) {
  const scaffoldFiles = files.filter(
    (file) =>
      !file.path.startsWith(DESIGN_DOCS_PREFIX) &&
      !SPEC_FILE_PATTERN.test(file.path),
  );

  if (scaffoldFiles.length === 0) {
    return false;
  }

  let addedLineCount = 0;
  let workInProgressLineCount = 0;

  for (const file of scaffoldFiles) {
    for (const line of file.diff.split('\n')) {
      if (!line.startsWith('+') || line.startsWith('+++')) {
        continue;
      }

      addedLineCount++;
      if (WORK_IN_PROGRESS_PATTERN.test(line.slice(1))) {
        workInProgressLineCount++;
      }
    }
  }

  if (addedLineCount === 0) {
    return false;
  }

  return (
    workInProgressLineCount / addedLineCount > SCAFFOLD_WIP_RATIO_THRESHOLD
  );
}
