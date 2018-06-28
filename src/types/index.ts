interface ChangedFile {
  file: string;
  explain: string;
  collapse?: boolean;
}

interface TutureMeta {
  name: string;
  language: string;
  version: string;
  description: string;
  maintainer: string;
  topics: string[];
}

interface Commit {
  name: string;
  commit: string;
}

interface Step extends Commit {
  explain: string;
  diff: ChangedFile[];
}

interface Tuture extends TutureMeta {
  steps: Step[];
}

interface Change {
  content: string;
  type: string;
  isInsert?: boolean;
  isNormal?: boolean;
  isDelete?: boolean;
  lineNumber?: number;
  oldLineNumber?: number;
  newLineNumber?: number;
}

interface Hunk {
  content: string;
  newLines: number;
  oldLines: number;
  oldStart: number;
  newStart: number;
  changes: Change[];
  isPlain?: boolean;
}

export { ChangedFile, TutureMeta, Commit, Step, Tuture, Change, Hunk };
