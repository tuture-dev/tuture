import { Hunk, Diff } from '../../../types/index';

const hunk: Hunk = {
  changes: [
    {
      type: 'insert',
      content: 'I am the coolest one',
      isInsert: true,
      lineNumber: 1,
    },
    {
      type: 'insert',
      content: 'I am the coolest one',
      isInsert: true,
      lineNumber: 2,
    },
  ],
  content: 'I am the coolest one',
  isPlain: false,
  newStart: 1,
  oldStart: 0,
  newLines: 5,
  oldLines: 1,
};

const diffItem: Diff = {
  file: 'cool.ts',
  explain: 'Can you be more funny?',
  collapse: false,
};
let diff: Diff[] = [];
Array(10).map(item => diff.push(diffItem));

export {
  hunk,
  diff,
}
