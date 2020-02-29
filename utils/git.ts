import fs from 'fs-extra';
import mm from 'micromatch';
import path from 'path';
import parseDiff, { File as DiffFile } from 'parse-diff';
import simplegit from 'simple-git/promise';

import logger from './logger';
import { emptyChildren, emptyExplain } from './nodes';
import { File, DiffBlock } from '../types';
import { TUTURE_ROOT } from '../constants';

// Interface for running git commands.
// https://github.com/steveukx/git-js
export const git = simplegit().silent(true);

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

/**
 * Get all changed files of a given commit.
 */
export async function getGitDiff(commit: string, ignoredFiles: string[]) {
  const output = await git.show([commit, '--name-only']);
  let changedFiles = output
    .split('\n\n')
    .slice(-1)[0]
    .split('\n');
  changedFiles = changedFiles.slice(0, changedFiles.length - 1);

  const fileProms = changedFiles.map((file) => {
    return new Promise<File | null>(async (resolve) => {
      try {
        const diffItem = parseDiff(
          await git.raw(['show', '-U99999', commit, file]),
        )[0];
        const diffBlock: DiffBlock = {
          type: 'diff-block',
          file,
          commit,
          hiddenLines: getHiddenLines(diffItem),
          children: emptyChildren,
        };
        const fileObj: File = {
          type: 'file',
          file,
          children: [emptyExplain, diffBlock, emptyExplain],
        };
        if (
          !ignoredFiles.some((pattern: string) => mm.isMatch(file, pattern))
        ) {
          fileObj.display = true;
        }

        resolve(fileObj);
      } catch {
        resolve(null);
      }
    });
  });

  const files = await Promise.all(fileProms);
  return files.filter((file) => file !== null);
}

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
    return { commit, diff };
  });

  const diffs = await Promise.all(diffPromises);

  fs.writeFileSync(path.join(TUTURE_ROOT, 'diff.json'), JSON.stringify(diffs));
}

/**
 * Append .tuture rule to gitignore.
 * If it's already ignored, do nothing.
 * If .gitignore doesn't exist, create one and add the rule.
 * @param config User config
 */
export function appendGitignore(config: any) {
  const ignoreRules = [
    '# Tuture-related files\n',
    TUTURE_ROOT,
    config.buildPath,
  ].join('\n');

  if (!fs.existsSync('.gitignore')) {
    fs.writeFileSync('.gitignore', `${ignoreRules}\n`);
    logger.log('info', '.gitignore file created.');
  } else if (
    !fs
      .readFileSync('.gitignore')
      .toString()
      .includes(TUTURE_ROOT)
  ) {
    fs.appendFileSync('.gitignore', `\n${ignoreRules}`);
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
      const origin = await git.remote(['get-url', remote]);
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
 * Generate Git hook for different platforms.
 */
function getGitHook() {
  let tuturePath = path.join(__dirname, '..', '..', 'bin', 'run');
  if (process.platform === 'win32') {
    // Replace all \ with / in the path, as is required in Git hook on windows
    // e.g. C:\foo\bar => C:/foo/bar
    tuturePath = tuturePath.replace(/\\/g, '/');
  }
  return `#!/bin/sh\n${tuturePath} reload\n`;
}

/**
 * Add post-commit Git hook for reloading.
 */
export function appendGitHook() {
  const reloadHook = getGitHook();
  const hookPath = path.join('.git', 'hooks', 'post-commit');
  if (!fs.existsSync(hookPath)) {
    fs.mkdirpSync(path.dirname(hookPath));
    fs.writeFileSync(hookPath, reloadHook, { mode: 0o755 });
    logger.log('info', 'Git post-commit hook added.');
  } else if (
    !fs
      .readFileSync(hookPath)
      .toString()
      .includes('reload')
  ) {
    fs.appendFileSync(hookPath, reloadHook);
    logger.log('info', 'Git post-commit hook configured.');
  }
}

/**
 * Remove Git hook for reloading.
 */
export function removeGitHook() {
  const reloadHook = getGitHook();
  const hookPath = path.join('.git', 'hooks', 'post-commit');
  if (fs.existsSync(hookPath)) {
    const hook = fs.readFileSync(hookPath).toString();
    if (hook === reloadHook) {
      // Auto-generated by Tuture, so delete it.
      fs.removeSync(hookPath);
    } else {
      fs.writeFileSync(hookPath, hook.replace('tuture reload', ''));
    }
    logger.log('info', 'Git post-commit hook removed.');
  }
}
