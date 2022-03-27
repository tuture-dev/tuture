import path from 'path';
import simplegit from 'simple-git/promise.js';

// Interface for running git commands.
// https://github.com/steveukx/git-js
export const git = simplegit().silent(true);

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
