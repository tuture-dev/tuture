import mm from 'micromatch';
import { INode, randHex } from '@tuture/core';
import { createGitHandler, readDiff } from '@tuture/local-server';

import { newEmptyExplain, newStepTitle, newEmptyFile } from './node.js';

/**
 * Initialize doc nodes from repository.
 */
export async function initNodes(ignoredFiles?: string[]): Promise<INode[]> {
  const git = createGitHandler();
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
      const fileNodes = await Promise.all(
        files.map(async (diffFile) => {
          const hidden = ignoredFiles?.some((pattern) =>
            mm.isMatch(diffFile.to!, pattern),
          );
          return await newEmptyFile(hash, diffFile, Boolean(hidden));
        }),
      );
      return [
        { type: 'step_start', attrs: delimiterAttrs },
        newStepTitle(stepAttrs, [{ type: 'text', text: message }]),
        newEmptyExplain({
          level: 'step',
          pos: 'pre',
          commit: hash,
        }),
        ...fileNodes.flat(),
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
