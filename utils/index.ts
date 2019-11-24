import fs from 'fs-extra';

import { Step } from '../types';
import { TUTURE_ROOT, TUTURE_YML_PATH } from '../constants';
import * as git from './git';

/**
 * Remove all Tuture-related files.
 */
export async function removeTutureSuite() {
  await fs.remove(TUTURE_YML_PATH);
  await fs.remove(TUTURE_ROOT);
}

/**
 * Store diff data of all commits and return corresponding steps.
 */
export async function makeSteps(ignoredFiles?: string[]) {
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
      diff: await git.getGitDiff(commits[idx], ignoredFiles || []),
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

/**
 * Generate HTML code for user profile with github repo url.
 */
export function generateUserProfile(github: string) {
  const matched = github.match(/github.com\/(.+)\/(.+)/);
  if (!matched) {
    return '';
  }

  const user = matched[1];
  const avatarUrl = `https://github.com/${user}.png?size=200`;
  const homepageUrl = `https://github.com/${user}`;

  return `<div class="profileBox">
  <div class="avatarBox">
    <a href="${homepageUrl}"><img src="${avatarUrl}" alt="${user}" class="avatar"></a>
  </div>
  <div class="rightBox">
    <div class="infoBox">
    <a href="${homepageUrl}"><p class="nickName">${user}</p></a>
  </div>
  <div class="codeBox">
    <a href="${github}"><span class="codeText">查看代码</span></a>
  </div>
  </div>
</div>`;
}
