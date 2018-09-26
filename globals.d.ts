declare type ExplainType = 'pre' | 'post';

declare type EditMode = 'edit' | 'preview';

declare interface Explain {
  pre?: string;
  post?: string;
}

declare interface Diff {
  file: string;
  explain?: Explain;
  display?: boolean;
}

declare interface TutureMeta {
  name: string;
  topics?: string[];
  description?: string;
}

declare interface Commit {
  name: string;
  commit: string;
}

declare interface Step extends Commit {
  explain?: Explain;
  diff: Diff[];
  outdated?: boolean;
}

declare interface Tuture extends TutureMeta {
  id?: string;
  steps: Step[];
}
