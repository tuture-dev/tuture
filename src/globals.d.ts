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
}

declare interface Tuture extends TutureMeta {
  steps: Step[];
}

declare interface Window {
  __APP_INITIAL_TUTURE__: any;
  __APP_INITIAL_DIFF__: any;
}
