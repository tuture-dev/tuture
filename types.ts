export interface Explain {
  type: 'explain';
  fixed: true;
  children: any[];
}

export interface DiffBlock {
  type: 'diff-block';
  file: string;
  commit: string;
  hiddenLines?: Array<number>;
  children: any[];
}

export interface File {
  type: 'file';
  file: string;
  display?: boolean;
  children: [Explain, DiffBlock, Explain];
}

export interface Meta {
  name: string;
  description: string;
  id: string;
  cover: string;
  created: Date;
  topics: string[];
  categories: string[];
}

export interface Article extends Meta {
  commits: string[];
}

export interface StepTitle {
  type: 'heading-two';
  commit: string;
  id: string;
  fixed: true;
  children: Node[];
}

export interface Step {
  type: 'step';
  id: string;
  articleId?: string | null;
  outdated?: boolean;
  commit: string;
  children: Array<StepTitle | Explain | File>;
}

export interface Collection extends Meta {
  github?: string;
  articles: Article[];
  steps: Step[];
}

export interface TutureConfig {
  ignoredFiles: string[];
  port: number;
}
