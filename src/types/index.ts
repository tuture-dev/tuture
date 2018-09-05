interface Explain {
  pre?: string;
  post?: string;
}

interface Section {
  start?: number;
  end?: number;
}

interface Diff {
  file: string;
  explain?: Explain;
  section?: Section;
  display?: boolean;
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
  diff: Diff[];
}

interface Tuture extends TutureMeta {
  steps: Step[];
}

export { Explain, Section, Diff, TutureMeta, Commit, Step, Tuture };
