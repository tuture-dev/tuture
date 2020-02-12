import fs from 'fs-extra';

import { Step } from '../types';
import { tutureYMLPath } from './tuture';
import { TUTURE_ROOT, TUTURE_BRANCH } from '../constants';
import { git, storeDiff, getGitDiff } from './git';

/**
 * Compare if two commit hashes are equal.
 */
function isCommitEqual(hash1: string, hash2: string) {
  return hash1.startsWith(hash2) || hash2.startsWith(hash1);
}

/**
 * Remove all Tuture-related files.
 */
export async function removeTutureSuite() {
  await fs.remove(TUTURE_ROOT);
}

/**
 * Store diff data of all commits and return corresponding steps.
 */
export async function makeSteps(
  ignoredFiles?: string[],
  contextLines?: number,
) {
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
  await storeDiff(commits, contextLines);

  const stepProms: Promise<Step>[] = logs.map(async ({ message, hash }) => {
    return {
      name: message,
      commit: hash,
      diff: await getGitDiff(hash, ignoredFiles || []),
    };
  });

  const steps = await Promise.all(stepProms);
  return steps;
}

/**
 * Merge previous and current steps. All previous explain will be kept.
 * If any step is rebased out, it will be marked outdated.
 */
export function mergeSteps(prevSteps: Step[], currentSteps: Step[]) {
  // Mark steps not included in latest steps as outdated.
  prevSteps.forEach((prevStep) => {
    if (
      !currentSteps.find(({ commit }) => isCommitEqual(commit, prevStep.commit))
    ) {
      prevStep.outdated = true; /* eslint no-param-reassign: "off"  */
    }
  });

  let [i, j] = [0, 0];
  const mergedSteps: Step[] = [];

  while (i < prevSteps.length || j < currentSteps.length) {
    if (i >= prevSteps.length) {
      mergedSteps.push(currentSteps[j]);
      j += 1;
    } else if (j >= currentSteps.length || prevSteps[i].outdated) {
      mergedSteps.push(prevSteps[i]);
      i += 1;
    } else if (isCommitEqual(prevSteps[i].commit, currentSteps[j].commit)) {
      mergedSteps.push(prevSteps[i]);
      i += 1;
      j += 1;
    } else {
      mergedSteps.push(currentSteps[j]);
      j += 1;
    }
  }

  return mergedSteps;
}

/**
 * Detect if tuture is initialized.
 */
export async function isInitialized() {
  if ((await git.checkIsRepo()) && (await git.branchLocal()).current) {
    const workspaceExists = fs.existsSync(tutureYMLPath);
    const branchExists = (await git.branch({ '-a': true })).all
      .map((branch) => branch.split('/').slice(-1)[0])
      .includes(TUTURE_BRANCH);
    return workspaceExists || branchExists;
  }

  return false;
}
