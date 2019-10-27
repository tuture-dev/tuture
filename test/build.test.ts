import fs from 'fs-extra';
import path from 'path';

import { createEmptyDir, tutureRunnerFactory, SyncRunner } from './utils';
import { DIFF_PATH, TUTURE_YML_PATH, TUTURE_ROOT } from '../constants';

// Tmp directories used in tests.
const tmpDirs: string[] = Array();

// Loading fixtures.
const fixturesDir = path.join(__dirname, 'fixtures');
const testDiffJSON = fs
  .readFileSync(path.join(fixturesDir, 'diff.json'))
  .toString();
const testTutureYML = fs
  .readFileSync(path.join(fixturesDir, 'tuture.yml'))
  .toString();
const expectedOutput = fs
  .readFileSync(path.join(fixturesDir, 'tutorial.md'))
  .toString();

describe('tuture build', () => {
  afterAll(() => tmpDirs.forEach((dir) => fs.removeSync(dir)));

  describe('normal build', () => {
    const repoPath = createEmptyDir();
    const tutureRunner = tutureRunnerFactory(repoPath) as SyncRunner;
    tmpDirs.push(repoPath);

    // Add necessary files to repoPath.
    fs.mkdirSync(path.join(repoPath, TUTURE_ROOT));
    fs.writeFileSync(path.join(repoPath, DIFF_PATH), testDiffJSON);
    fs.writeFileSync(path.join(repoPath, TUTURE_YML_PATH), testTutureYML);

    describe('output to default tutorial.md', () => {
      const cp = tutureRunner(['build']);

      it('should exit with status 0', () => {
        expect(cp.status).toBe(0);
      });

      it('should output correct markdown content', () => {
        const generated = fs
          .readFileSync(
            path.join(repoPath, 'tuture-build', 'My Awesome Tutorial.md'),
          )
          .toString();
        expect(generated).toBe(expectedOutput);
      });
    });

    describe('output to specified file', () => {
      const dest = 'test.md';
      const cp = tutureRunner(['build', '-o', dest]);

      it('should exit with status 0', () => {
        expect(cp.status).toBe(0);
      });

      it('should output correct markdown content', () => {
        const generated = fs.readFileSync(path.join(repoPath, dest)).toString();
        expect(generated).toBe(expectedOutput);
      });
    });
  });

  describe('no tuture files present', () => {
    const nonTuturePath = createEmptyDir();
    const tutureRunner = tutureRunnerFactory(nonTuturePath) as SyncRunner;
    tmpDirs.push(nonTuturePath);

    const cp = tutureRunner(['build']);

    it('should refuse to destroy', () => {
      expect(cp.status).not.toBe(0);
    });
  });
});
