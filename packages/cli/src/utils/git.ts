import fs from 'fs-extra';
import path from 'path';
import simplegit from 'simple-git/promise';
import { TUTURE_ROOT, TUTURE_BRANCH } from '@tuture/core';

import logger from './logger';

// Interface for running git commands.
// https://github.com/steveukx/git-js
export const git = simplegit().silent(true);

/**
 * Whether the local tuture branch exists.
 */
export async function hasLocalTutureBranch() {
  return (await git.branchLocal()).all.includes(TUTURE_BRANCH);
}

/**
 * Whether the remote tuture branch exists.
 */
export async function hasRemoteTutureBranch() {
  const remote = await git.remote([]);

  if (!remote) {
    logger.log('warning', 'No remote found for this repository.');
    return false;
  }

  const branchExists = async (branch: string) => {
    const { all } = await git.branch({ '-a': true });
    return all.includes(branch);
  };

  const remoteBranch = `remotes/${remote.trim()}/${TUTURE_BRANCH}`;

  // Trying to update remote branches (time-consuming).
  await git.remote(['update', '--prune']);

  return await branchExists(remoteBranch);
}

/**
 * Fetch tuture branch from remote.
 */
export async function initializeTutureBranch() {
  const { all: allBranches } = await git.branch({ '-a': true });

  // Already exists.
  if (allBranches.includes(TUTURE_BRANCH)) {
    return;
  }

  const remoteBranchIndex = allBranches
    .map((branch) => branch.split('/').slice(-1)[0])
    .indexOf(TUTURE_BRANCH);

  if (remoteBranchIndex < 0) {
    await git.branch([TUTURE_BRANCH]);
    logger.log('info', 'New tuture branch has been created.');
  } else {
    const [_, remote, branch] = allBranches[remoteBranchIndex].split('/');
    await git.fetch(remote, branch);
    logger.log('success', 'Remote tuture branch has been fetched.');
  }
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
  // const { all } = await git.log();
  // const gitCommits = all
  //   .filter((log) => !log.message.startsWith('tuture:'))
  //   .map((log) => log.hash);

  // const { steps } = loadCollection();
  // const collectionCommits = steps
  //   .filter((step) => !step.outdated)
  //   .map((step) => step.commit);

  // collectionCommits.reverse();

  // let shouldReload = false;

  // for (
  //   let i = 0;
  //   i < Math.min(gitCommits.length, collectionCommits.length);
  //   i++
  // ) {
  //   if (!isCommitEqual(gitCommits[i], collectionCommits[i])) {
  //     shouldReload = true;
  //     break;
  //   }
  // }

  // return shouldReload;
  return false;
}
