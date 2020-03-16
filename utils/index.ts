import chalk from 'chalk';
import fs from 'fs-extra';
import mm from 'micromatch';
import shortid from 'shortid';
import { File as DiffFile } from 'parse-diff';

import { Step, File, DiffBlock } from '../types';
import { getEmptyExplain, getEmptyChildren } from './nodes';
import { collectionPath } from './collection';
import { TUTURE_ROOT, TUTURE_BRANCH } from '../constants';
import { git, storeDiff } from './git';

/**
 * Compare if two commit hashes are equal.
 */
export function isCommitEqual(hash1: string, hash2: string) {
  return hash1.startsWith(hash2) || hash2.startsWith(hash1);
}

/**
 * Remove all Tuture-related files.
 */
export async function removeTutureSuite() {
  await fs.remove(TUTURE_ROOT);
}

function getHiddenLines(diffItem: DiffFile): number[] {
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

  return shownArr
    .map((elem, index) => (elem ? null : index))
    .filter((elem) => elem !== null) as number[];
}

function convertFile(commit: string, file: DiffFile, display = false) {
  const diffBlock: DiffBlock = {
    type: 'diff-block',
    file: file.to!,
    commit,
    hiddenLines: getHiddenLines(file),
    children: getEmptyChildren(),
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
      id: shortid.generate(),
      articleId: null,
      commit: hash,
      children: [
        {
          type: 'heading-two',
          commit: hash,
          id: shortid.generate(),
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
export async function checkInitStatus() {
  const isRepo = await git.checkIsRepo();

  if (!isRepo) {
    throw new Error(
      `Not in a git repository. Run ${chalk.bold('git init')} or ${chalk.bold(
        'tuture init',
      )} to initialize.`,
    );
  }

  const { current: currentBranch } = await git.branchLocal();
  if (!currentBranch) {
    throw new Error('Current branch does not have any commits yet.');
  }

  const workspaceExists = fs.existsSync(collectionPath);
  const branchExists = (await git.branch({ '-a': true })).all
    .map((branch) => branch.split('/').slice(-1)[0])
    .includes(TUTURE_BRANCH);

  if (!workspaceExists && !branchExists) {
    throw new Error(
      `Tuture is not initialized. Run ${chalk.bold(
        'tuture init',
      )} to initialize.`,
    );
  }
}
