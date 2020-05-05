import chalk from 'chalk';
import fs from 'fs-extra';
import mm from 'micromatch';
import { prompt } from 'inquirer';
import {
  Step,
  File,
  Remote,
  DiffBlock,
  DiffFile,
  randHex,
  isCommitEqual,
  TUTURE_ROOT,
  TUTURE_BRANCH,
} from '@tuture/core';
import { collectionPath } from '@tuture/local-server';

import logger from './logger';
import { git, storeDiff } from './git';
import { getEmptyExplain } from './nodes';

/**
 * Remove all Tuture-related files.
 */
export async function removeTutureSuite() {
  await fs.remove(TUTURE_ROOT);
}

type Range = [number, number];

function getHiddenLines(diffItem: DiffFile): Range[] {
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

  const hiddenLines: Range[] = [];
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

function convertFile(commit: string, file: DiffFile, display = false) {
  const diffBlock: DiffBlock = {
    type: 'diff-block',
    file: file.to!,
    commit,
    hiddenLines: getHiddenLines(file),
    children: [{ text: '' }],
  };
  const fileObj: File = {
    type: 'file',
    file: file.to!,
    display,
    children: [getEmptyExplain(), diffBlock, getEmptyExplain()],
  };

  return fileObj;
}

/**
 * Store diff data of all commits and return corresponding steps.
 */
export async function makeSteps(ignoredFiles?: string[]) {
  if (!(await git.branchLocal()).current) {
    // No commits yet.
    return [];
  }

  const logs = (await git.log({ '--no-merges': true })).all
    .map(({ message, hash }) => ({ message, hash }))
    .reverse()
    // filter out commits whose commit message starts with 'tuture:'
    .filter(({ message }) => !message.startsWith('tuture:'));

  // Store all diff into .tuture/diff.json
  const commits = logs.map(({ hash }) => hash);
  const diffs = await storeDiff(commits);

  const stepProms: Promise<Step>[] = logs.map(async ({ message, hash }) => {
    const diff = diffs.filter((diff) => isCommitEqual(diff.commit, hash))[0];
    const files = diff.diff;
    return {
      type: 'step',
      id: randHex(8),
      articleId: null,
      commit: hash,
      children: [
        {
          type: 'heading-two',
          commit: hash,
          id: randHex(8),
          fixed: true,
          children: [{ text: message }],
        },
        getEmptyExplain(),
        ...files.map((diffFile) => {
          const display =
            ignoredFiles &&
            !ignoredFiles.some((pattern: string) =>
              mm.isMatch(diffFile.to!, pattern),
            );
          return convertFile(hash, diffFile, display);
        }),
        getEmptyExplain(),
      ],
    } as Step;
  });

  const steps = await Promise.all(stepProms);
  return steps;
}

/**
 * Merge previous and current steps. All previous explain will be kept.
 * If any step is rebased out, it will be marked outdated and added to the end.
 */
export function mergeSteps(prevSteps: Step[], currentSteps: Step[]) {
  const steps = currentSteps.map((currentStep) => {
    const prevStep = prevSteps.filter((step) =>
      isCommitEqual(step.commit, currentStep.commit),
    )[0];

    // If previous step with the same commit exists, copy it.
    // Or just return the new step.
    return prevStep || currentStep;
  });

  // Outdated steps are those not included in current git history.
  const outdatedSteps = prevSteps
    .filter((prevStep) => {
      const currentStep = currentSteps.filter((step) =>
        isCommitEqual(step.commit, prevStep.commit),
      )[0];
      return !currentStep;
    })
    .map((prevStep) => ({ ...prevStep, outdated: true }));

  return steps.concat(outdatedSteps);
}

/**
 * Detect if tuture is initialized.
 */
export async function checkInitStatus(nothrow = false) {
  const isRepo = await git.checkIsRepo();

  if (!isRepo) {
    if (nothrow) return false;

    throw new Error(
      `Not in a git repository. Run ${chalk.bold('git init')} or ${chalk.bold(
        'tuture init',
      )} to initialize.`,
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
  remotes: Remote[],
  selected: Remote[] = [],
) {
  // All remotes are shown as:
  // <remote_name> (fetch: <fetch_ref>, push: <push_ref>)
  const remoteToChoice = (remote: Remote) => {
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
