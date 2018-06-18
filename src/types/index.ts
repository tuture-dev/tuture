interface Diff {
  file: string;
  explain: string;
  collapse?: boolean;
}

interface Step {
  name: string;
  commit: string;
  explain: string;
  diff: Diff[];
}

interface Tuture {
  name: string;
  language: string;
  version: string;
  topics: string[];
  description: string;
  maintainer: string;
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

export {
  Diff,
  Step,
  Tuture,
  Change,
  Hunk,
}
