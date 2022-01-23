import mm from 'micromatch';
import { INode, randHex } from '@tuture/core';
import { git, readDiff } from '@tuture/local-server';

import { newEmptyExplain, newStepTitle, newEmptyFile } from './node.js';

/**
 * Initialize doc nodes from repository.
 */
export async function initNodes(ignoredFiles?: string[]): Promise<INode[]> {
  if (!(await git.branchLocal()).current) {
    // No commits yet.
    return [];
  }

  const logs = (await git.log({ '--no-merges': true })).all
    .map(({ message, hash }) => ({ message, hash }))
    .reverse()
    // filter out commits whose commit message starts with 'tuture:'
    .filter(({ message }) => !message.startsWith('tuture:'));

  const nodeProms: Promise<INode[]>[] = logs.map(
    async ({ message, hash }, index) => {
      const files = await readDiff(hash);
      const delimiterAttrs = { commit: hash };
      const stepAttrs = {
        id: randHex(32),
        name: message,
        commit: hash,
        order: index,
      };
      return [
        { type: 'step_start', attrs: delimiterAttrs },
        newStepTitle(stepAttrs, [{ type: 'text', text: message }]),
        newEmptyExplain({
          level: 'step',
          pos: 'pre',
          commit: hash,
        }),
        ...files.flatMap((diffFile) => {
          const hidden = ignoredFiles?.some((pattern) =>
            mm.isMatch(diffFile.to!, pattern),
          );
          return newEmptyFile(hash, diffFile, Boolean(hidden)).flat();
        }),
        newEmptyExplain({
          level: 'step',
          pos: 'post',
          commit: hash,
        }),
        { type: 'step_end', attrs: delimiterAttrs },
      ];
    },
  );

  const nodes = await Promise.all(nodeProms);
  return nodes.flat();
}
