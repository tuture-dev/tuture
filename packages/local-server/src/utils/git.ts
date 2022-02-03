import simplegit from 'simple-git/promise.js';
import parseDiff from 'parse-diff';
import { DiffFile } from '@tuture/core';

// Interface for running git commands.
// https://github.com/steveukx/git-js
export function createGitHandler(basePath?: string) {
  return simplegit(basePath).silent(true);
}

/**
 * Data type for a single git commit.
 */
export type Commit = {
  hash: string;
  message: string;
};

/**
 * Read and parse diff from git command.
 * @param commit git commit hash
 * @returns RawDiff object
 */
export async function readDiff(commit: string): Promise<DiffFile[]> {
  const git = createGitHandler();
  const output = await git.raw(['show', '-U99999', commit]);
  const diffText = output
    .replace(/\\ No newline at end of file\n/g, '')
    .split('\n\n')
    .slice(-1)[0];
  return parseDiff(diffText);
}

/**
 * Read file at given revision
 * @param commit git revision (commit SHA, tag, etc.)
 * @param file file path
 * @returns file content
 */
export async function readFileAtCommit(
  commit: string,
  file: string,
): Promise<string> {
  const git = createGitHandler();
  return await git.raw(['show', '-U99999', `${commit}:${file}`]);
}
