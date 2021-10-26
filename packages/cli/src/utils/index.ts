import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import mm from 'micromatch';
import { prompt } from 'inquirer';
import {
  INode,
  IRemote,
  StepDoc,
  TUTURE_ROOT,
  TUTURE_DOC_ROOT,
  TUTURE_BRANCH,
  randHex,
} from '@tuture/core';
import {
  git,
  readDiff,
  Commit,
  collectionPath,
  loadCollection,
  loadArticle,
} from '@tuture/local-server';

import { newEmptyExplain, newStepTitle, newEmptyFile } from './node';
import logger from './logger';

export const docRoot = path.join(
  process.env.TUTURE_PATH || process.cwd(),
  TUTURE_ROOT,
  TUTURE_DOC_ROOT,
);

/**
 * Remove all Tuture-related files.
 */
export async function removeTutureSuite() {
  await fs.remove(TUTURE_ROOT);
}

type ArticleDoc = {
  articleId: string;
  doc: INode;
};

/**
 * Load nodes from tuture root.
 * @returns current nodes from tuture root.
 */
export function loadArticleDocs(): ArticleDoc[] {
  const collection = loadCollection();
  return collection.articles.map(({ id }) => ({
    articleId: id,
    doc: loadArticle(id),
  }));
}

/**
 * Initialize steps from repository.
 */
export async function initSteps(
  articleId: string,
  ignoredFiles?: string[],
): Promise<StepDoc[]> {
  if (!(await git.branchLocal()).current) {
    // No commits yet.
    return [];
  }

  const logs = (await git.log({ '--no-merges': true })).all
    .map(({ message, hash }) => ({ message, hash }))
    .reverse()
    // filter out commits whose commit message starts with 'tuture:'
    .filter(({ message }) => !message.startsWith('tuture:'));

  const nodeProms = logs.map(async ({ message, hash }, index) => {
    const files = await readDiff(hash);
    const delimiterAttrs = { commit: hash };
    const stepAttrs = {
      articleId,
      id: randHex(32),
      name: message,
      commit: hash,
      order: index,
    };
    return {
      type: 'doc',
      attrs: stepAttrs,
      content: [
        { type: 'step_start', attrs: stepAttrs },
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
      ],
    } as StepDoc;
  });

  return await Promise.all(nodeProms);
}

/**
 * Detect if tuture is initialized.
 */
export async function checkInitStatus(nothrow = false) {
  const isRepo = await git.checkIsRepo();

  if (!isRepo) {
    if (nothrow) return false;

    throw new Error(
      `Not in a git repository. Run \`git init\` or \`tuture init\` to initialize.`,
    );
  }

  const { current: currentBranch } = await git.branchLocal();
  if (!currentBranch) {
    if (nothrow) return false;

    throw new Error('Current branch does not have any commits yet.');
  }

  if (fs.existsSync(collectionPath)) {
    return true;
  }

  const branchExists = async () => {
    return (await git.branch({ '-a': true })).all
      .map((branch) => branch.split('/').slice(-1)[0])
      .includes(TUTURE_BRANCH);
  };

  if (await branchExists()) {
    return true;
  }

  // Trying to update remote branches (time-consuming).
  logger.log('info', 'Trying to update remote branches ...');
  await git.remote(['update', '--prune']);

  if (!(await branchExists())) {
    if (nothrow) return false;

    throw new Error(
      `Tuture is not initialized. Run ${chalk.bold(
        'tuture init',
      )} to initialize.`,
    );
  }

  return true;
}

export async function selectRemotes(
  remotes: IRemote[],
  selected: IRemote[] = [],
) {
  // All remotes are shown as:
  // <remote_name> (fetch: <fetch_ref>, push: <push_ref>)
  const remoteToChoice = (remote: IRemote) => {
    const { name, refs } = remote;
    const { fetch, push } = refs;
    const { underline } = chalk;

    return `${name} (fetch: ${underline(fetch)}, push: ${underline(push)})`;
  };

  const choiceToRemote = (choice: string) => {
    const selectedRemote = choice.slice(0, choice.indexOf('(') - 1);
    return remotes.filter((remote) => remote.name === selectedRemote)[0];
  };

  const response = await prompt<{ remotes: string[] }>([
    {
      name: 'remotes',
      type: 'checkbox',
      message: 'Select remote repositories you want to sync to:',
      choices: remotes.map((remote) => remoteToChoice(remote)),
      default: selected.map((remote) => remoteToChoice(remote)),
    },
  ]);

  return response.remotes.map((choice) => choiceToRemote(choice));
}
