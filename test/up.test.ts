import fs from 'fs-extra';
import path from 'path';

import { createEmptyDir, createGitRepo, tutureRunnerFactory } from './utils';

// Tmp directories used in tests.
const tmpDirs: string[] = Array();

describe('tuture up', () => {
  afterAll(() => tmpDirs.forEach((dir) => fs.removeSync(dir)));

  describe('tuture is not initialized', () => {
    const nonTuturePath = createEmptyDir();
    const tutureRunner = tutureRunnerFactory(nonTuturePath);
    tmpDirs.push(nonTuturePath);

    it('should refuse to up', () => {
      const cp = tutureRunner(['up']);
      expect(cp.status).not.toBe(0);
    });
  });

  describe('tuture.yml syntax error', () => {
    const repoPath = createGitRepo();
    const tutureRunner = tutureRunnerFactory(repoPath);
    tmpDirs.push(repoPath);
    tutureRunner(['init', '-y']);

    const flawedTuture = 'foo: bar:';
    fs.writeFileSync(path.join(repoPath, 'tuture.yml'), flawedTuture);

    it('should report syntax error', () => {
      const cp = tutureRunner(['up']);
      expect(cp.status).not.toBe(0);
    });
  });
});
