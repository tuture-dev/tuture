import cp from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import tmp from 'tmp';

import { DIFF_PATH } from '../config';

export interface Commit {
  message: string;
  files: string[];
}

export const exampleRepo: Commit[] = [
  {
    message: 'Commit 1',
    files: ['test1.js', 'test2.js'],
  },
  {
    message: 'Commit 2',
    files: ['test3.js'],
  },
];

export type SyncRunner = (args: string[]) => cp.SpawnSyncReturns<Buffer>;
export type AsyncRunner = (args: string[]) => cp.ChildProcess;

/**
 * Factory of functions running tuture commands in a given directory.
 */
export function tutureRunnerFactory(
  cwd: string,
  async = false,
): SyncRunner | AsyncRunner {
  const tuturePath = path.join(__dirname, '..', 'bin', 'run');
  if (async) {
    return function (args: string[]) {
      return cp.spawn('node', [tuturePath, ...args], { cwd });
    };
  }
  return function (args: string[]) {
    return cp.spawnSync('node', [tuturePath, ...args], { cwd });
  };
}

/**
 * Factory of functions running git commands in a given directory.
 */
export function gitRunnerFactory(cwd: string): SyncRunner {
  return function (args: string[]) {
    return cp.spawnSync('git', args, { cwd });
  };
}

/**
 * Create an empty temporary directory.
 */
export function createEmptyDir() {
  return tmp.dirSync().name;
}

/**
 * Create a temporary Git repo.
 */
export function createGitRepo(repo = exampleRepo, ignoreTuture = false) {
  const repoPath = tmp.dirSync().name;
  const gitRunner = gitRunnerFactory(repoPath);

  gitRunner(['init']);

  repo.forEach((commit) => {
    commit.files.forEach((fileName) => {
      const dir = path.parse(fileName).dir;
      if (dir) fs.mkdirpSync(path.join(repoPath, dir));
      if (fileName === '.gitignore' && ignoreTuture) {
        fs.writeFileSync(path.join(repoPath, fileName), '.tuture\n');
      } else {
        fs.createFileSync(path.join(repoPath, fileName));
      }
    });
    gitRunner(['add', ...commit.files]);
    gitRunner(['commit', '-m', commit.message]);
  });

  return repoPath;
}

export function parseDiffJSON(repoPath: string) {
  return JSON.parse(fs.readFileSync(path.join(repoPath, DIFF_PATH)).toString());
}
