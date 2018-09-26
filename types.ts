export interface Explain {
  pre?: string;
  post?: string;
}

export interface Section {
  start?: number;
  end?: number;
}

export interface Diff {
  file: string;
  display?: boolean;
  explain?: Explain;
  section?: Section;
}

export interface Step {
  name: string;
  commit: string;
  explain?: Explain;
  outdated?: true;
  diff: Diff[];
}

export interface TutureMetadata {
  id: string;
  name: string;
  topics?: string[];
  description?: string;
}

export interface Tuture extends TutureMetadata {
  steps: Step[];
}

export interface TutureConfig {
  ignoredFiles: string[];
  port: number;
}
