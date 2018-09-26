import fs from 'fs-extra';

import { tutureRoot } from '../config';
import * as git from './git';

/**
 * Remove all Tuture-related files.
 */
export async function removeTutureSuite() {
  await fs.remove('tuture.yml');
  await fs.remove(tutureRoot);
}

/**
 * Store diff data of all commits and return corresponding steps.
 */
export async function makeSteps() {
  let logs = await git.getGitLogs();
  logs = logs
    .reverse()
    // filter out commits whose commit message starts with 'tuture:'
    .filter((log) => !log.slice(8, log.length).startsWith('tuture:'));

  // Store all diff into .tuture/diff.json
  const commits = logs.map((log) => log.slice(0, 7));
  await git.storeDiff(commits);

  const stepProms: Promise<Step>[] = logs.map(async (log, idx) => {
    const msg = log.slice(8, log.length);
    return {
      name: msg,
      commit: commits[idx],
      diff: await git.getGitDiff(commits[idx]),
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
    if (!currentSteps.find((step) => step.commit === prevStep.commit)) {
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
    } else if (prevSteps[i].commit === currentSteps[j].commit) {
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
