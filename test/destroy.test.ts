import fs from 'fs-extra';
import path from 'path';

import { createEmptyDir, createGitRepo, tutureRunnerFactory } from './utils';

// Tmp directories used in tests.
const tmpDirs: string[] = Array();

describe('tuture destroy', () => {
  afterAll(() => tmpDirs.forEach((dir) => fs.removeSync(dir)));

  describe('normal destroy', () => {
    const repoPath = createGitRepo();
    const tutureRunner = tutureRunnerFactory(repoPath);
    tmpDirs.push(repoPath);

    tutureRunner(['init', '-y']);

    const cp = tutureRunner(['destroy', '-f']);

    it('should exit with status 0', () => {
      expect(cp.status).toBe(0);
    });

    it('should delete all tuture files', () => {
      expect(fs.existsSync(path.join(repoPath, '.tuture'))).toBe(false);
      expect(fs.existsSync(path.join(repoPath, 'tuture.yml'))).toBe(false);
    });

    it('should have no post-commit git hook', () => {
      const hookPath = path.join(repoPath, '.git', 'hooks', 'post-commit');
      if (fs.existsSync(hookPath)) {
        const hook = fs.readFileSync(hookPath).toString();
        // @ts-ignore
        expect(hook).toEqual(expect.not.stringContaining('tuture reload'));
      }
    });
  });

  describe('no tuture files present', () => {
    const nonTuturePath = createEmptyDir();
    const tutureRunner = tutureRunnerFactory(nonTuturePath);
    tmpDirs.push(nonTuturePath);

    const cp = tutureRunner(['destroy', '-f']);

    it('should refuse to destroy', () => {
      expect(cp.status).not.toBe(0);
    });
  });
});
