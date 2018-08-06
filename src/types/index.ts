interface Explain {
  pre?: string;
  post?: string;
}

interface CodeSection {
  start?: number;
  end?: number;
}

interface ChangedFile {
  file: string;
  explain?: Explain;
  section?: CodeSection;
}

interface TutureMeta {
  name: string;
  language: string;
  version: string;
  description?: string;
  maintainer?: string;
  topics?: string[];
}

interface Commit {
  name: string;
  commit: string;
}

interface Step extends Commit {
  explain?: Explain;
  diff: ChangedFile[];
}

interface Tuture extends TutureMeta {
  steps: Step[];
}

export { Explain, CodeSection, ChangedFile, TutureMeta, Commit, Step, Tuture };
