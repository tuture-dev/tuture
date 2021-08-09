// Ported from https://github.com/sergeyt/parse-diff.

export interface DiffFile {
  chunks: Chunk[];
  deletions: number;
  additions: number;
  from?: string;
  to?: string;
  index?: string[];
  deleted?: true;
  new?: true;
}

export interface Chunk {
  content: string;
  changes: Change[];
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
}

export interface NormalChange {
  type: 'normal';
  ln1: number;
  ln2: number;
  normal: true;
  content: string;
}

export interface AddChange {
  type: 'add';
  add: true;
  ln: number;
  content: string;
}

export interface DeleteChange {
  type: 'del';
  del: true;
  ln: number;
  content: string;
}

export type ChangeType = 'normal' | 'add' | 'del';

export type Change = NormalChange | AddChange | DeleteChange;

export type HiddenRange = [number, number];

export function getHiddenLines(diffItem: DiffFile): HiddenRange[] {
  // Number of context normal lines to show for each diff.
  const context = 3;

  if (diffItem.chunks.length === 0) {
    return [];
  }

  // An array to indicate whether a line should be shown.
  const shownArr = diffItem.chunks[0].changes.map(
    (change) => change.type !== 'normal',
  );

  let contextCounter = -1;
  for (let i = 0; i < shownArr.length; i++) {
    if (shownArr[i]) {
      contextCounter = context;
    } else {
      contextCounter--;
      if (contextCounter >= 0) {
        shownArr[i] = true;
      }
    }
  }

  contextCounter = -1;
  for (let i = shownArr.length - 1; i >= 0; i--) {
    if (shownArr[i]) {
      contextCounter = context;
    } else {
      contextCounter--;
      if (contextCounter >= 0) {
        shownArr[i] = true;
      }
    }
  }

  const hiddenLines: HiddenRange[] = [];
  let startNumber = null;

  for (let i = 0; i < shownArr.length; i++) {
    if (!shownArr[i] && startNumber === null) {
      startNumber = i;
    } else if (i > 0 && !shownArr[i - 1] && shownArr[i]) {
      hiddenLines.push([startNumber!, i - 1]);
      startNumber = null;
    }
  }

  return hiddenLines;
}
