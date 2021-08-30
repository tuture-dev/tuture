import simplegit from 'simple-git/promise';
import parseDiff from 'parse-diff';
import { DiffFile, TUTURE_COMMIT_PREFIX } from '@tuture/core';

// Interface for running git commands.
// https://github.com/steveukx/git-js
export const git = simplegit().silent(true);

/**
 * Data type for a single git commit.
 */
export type Commit = {
  hash: string;
  message: string;
};

/**
 * List all commits on current branch from the repository.
 * @returns Hashes and messages of all commits.
 */
export async function listAllCommits(): Promise<Commit[]> {
  const logs = await git.log({ '--no-merges': true });
  return (
    logs.all
      .map(({ message, hash }) => ({ message, hash }))
      .reverse()
      // filter out commits whose commit message starts with 'tuture:'
      .filter(({ message }) => !message.startsWith(TUTURE_COMMIT_PREFIX))
  );
}

/**
 * Read and parse diff from git command.
 * @param commit git commit hash
 * @returns RawDiff object
 */
export async function readDiff(commit: string): Promise<DiffFile[]> {
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
  return await git.raw(['show', '-U99999', `${commit}:${file}`]);
}
