export interface Explain {
  pre?: string;
  post?: string;
}

export interface Diff {
  file: string;
  explain?: Explain;
  display?: boolean;
}

export interface Split {
  start: string;
  end: string;
  name?: string;
  description?: string;
}

export interface TutureMeta {
  name: string;
  topics?: string[];
  categories?: string[];
  description?: string;
  created?: Date;
  updated?: Date;
  github?: string;
  splits?: Split[];
}

export interface Commit {
  name: string;
  commit: string;
}

export interface Step extends Commit {
  explain?: Explain;
  diff: Diff[];
  outdated?: boolean;
}

export interface Tuture extends TutureMeta {
  id?: string;
  steps: Step[];
}

export interface TutureConfig {
  ignoredFiles: string[];
  port: number;
}
