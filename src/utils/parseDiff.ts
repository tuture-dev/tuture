// @ts-ignore
import parser from 'gitdiff-parser';

import { File } from '../components/StepDiff';
import { Hunk } from '../types';

const parseDiff = (text: string, options = {}) => {
  const files: File[] = parser.parse(text);

  return files.map((file: File) => {
    const hunks: Hunk[] = file.hunks.map((hunk: Hunk) => ({
      ...hunk,
      isPlain: false,
    }));

    return { ...file, hunks };
  });
};

export default parseDiff;
