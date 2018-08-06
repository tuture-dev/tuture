import { Hunk, ChangedFile } from '../../../types';

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

const diffItem: ChangedFile = {
  file: 'cool.ts',
  explain: {
    pre: 'Can you be more funny?',
    post: 'Oh yes',
  },
};
const diff: ChangedFile[] = [];
Array(10).map(() => diff.push(diffItem));

export { hunk, diff };
