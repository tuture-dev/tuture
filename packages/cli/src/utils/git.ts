import fs from 'fs-extra';
import path from 'path';
import parseDiff from 'parse-diff';
import simplegit from 'simple-git/promise';
import { RawDiff, TUTURE_ROOT, DIFF_PATH, isCommitEqual } from '@tuture/core';
import { loadCollection } from '@tuture/local-server';

import logger from './logger';

// Interface for running git commands.
// https://github.com/steveukx/git-js
export const git = simplegit().silent(true);

export const diffPath = path.join(
  process.env.TUTURE_PATH || process.cwd(),
  TUTURE_ROOT,
  DIFF_PATH,
);

/**
 * Store diff of all commits.
 */
export async function storeDiff(commits: string[]) {
  const diffPromises = commits.map(async (commit: string) => {
    const command = ['show', '-U99999', commit];
    const output = await git.raw(command);
    const diffText = output
      .replace(/\\ No newline at end of file\n/g, '')
      .split('\n\n')
      .slice(-1)[0];
    const diff = parseDiff(diffText);
    return { commit, diff } as RawDiff;
  });

  const diffs = await Promise.all(diffPromises);

  fs.writeFileSync(diffPath, JSON.stringify(diffs));

  return diffs;
}

/**
 * Append .tuture rule to gitignore.
 * If it's already ignored, do nothing.
 * If .gitignore doesn't exist, create one and add the rule.
 */
export function appendGitignore() {
  if (!fs.existsSync('.gitignore')) {
    fs.writeFileSync('.gitignore', `${TUTURE_ROOT}\n`);
    logger.log('info', '.gitignore file created.');
  } else if (
    !fs
      .readFileSync('.gitignore')
      .toString()
      .includes(TUTURE_ROOT)
  ) {
    fs.appendFileSync('.gitignore', `\n${TUTURE_ROOT}`);
    logger.log('info', '.gitignore rules appended.');
  }
}

/**
 * Infer github field from available information.
 */
export async function inferGithubField() {
  let github: string = '';
  try {
    // Trying to infer github repo url from origin.
    const remote = await git.remote([]);
    if (remote) {
      const origin = await git.remote(['get-url', remote.trim()]);
      if (origin) {
        github = origin.replace('.git', '').trim();
      }
    }
  } catch {
    // No remote url, infer github field from git username and cwd.
    let username = await git.raw(['config', '--get', 'user.name']);
    if (!username) {
      username = await git.raw(['config', '--global', '--get', 'user.name']);
    }

    if (username) {
      const { name: repoName } = path.parse(process.cwd());
      github = `https://github.com/${username.trim()}/${repoName}`;
    }
  }

  return github;
}

/**
 * Determine whether we should run `reload` command.
 */
export async function shouldReloadSteps() {
  const { all } = await git.log();
  const gitCommits = all
    .filter((log) => !log.message.startsWith('tuture:'))
    .map((log) => log.hash);

  const { steps } = loadCollection();
  const collectionCommits = steps
    .filter((step) => !step.outdated)
    .map((step) => step.commit);

  collectionCommits.reverse();

  let shouldReload = false;

  for (
    let i = 0;
    i < Math.min(gitCommits.length, collectionCommits.length);
    i++
  ) {
    if (!isCommitEqual(gitCommits[i], collectionCommits[i])) {
      shouldReload = true;
      break;
    }
  }

  return shouldReload;
}
