export interface Explain {
  pre?: string;
  post?: string;
}

export interface Diff {
  file: string;
  explain?: Explain;
  display?: boolean;
}

export interface TutureMeta {
  name: string;
  topics?: string[];
  categories?: string[];
  description?: string;
  created?: Date;
  updated?: Date;
  cover?: string;
  github?: string;
}

export interface Split extends TutureMeta {
  start: string;
  end: string;
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
  splits?: Split[];
  steps: Step[];
}

export interface TutureConfig {
  ignoredFiles: string[];
  port: number;
}
