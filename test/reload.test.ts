import fs from 'fs-extra';
import path from 'path';
import yaml from 'js-yaml';
import clonedeep from 'lodash.clonedeep';

import {
  exampleRepo,
  createEmptyDir,
  createGitRepo,
  parseDiffJSON,
  gitRunnerFactory,
  tutureRunnerFactory,
  SyncRunner,
} from './utils';

// Tmp directories used in tests.
const tmpDirs: string[] = Array();

describe('tuture reload', () => {
  afterAll(() => tmpDirs.forEach((dir) => fs.removeSync(dir)));

  describe('tuture is not initialized', () => {
    const nonRepoPath = createEmptyDir();
    const tutureRunner = tutureRunnerFactory(nonRepoPath) as SyncRunner;
    tmpDirs.push(nonRepoPath);

    it('should refuse to reload', () => {
      const cp = tutureRunner(['reload']);
      expect(cp.status).not.toBe(0);
    });
  });

  describe('automatic reload', () => {
    describe('add commits plainly', () => {
      const repoPath = createGitRepo();
      const tutureRunner = tutureRunnerFactory(repoPath) as SyncRunner;
      const gitRunner = gitRunnerFactory(repoPath);
      const tutureYmlPath = path.join(repoPath, 'tuture.yml');
      tmpDirs.push(repoPath);

      tutureRunner(['init', '-y']);

      // Write some explanations.
      const tuture = yaml.safeLoad(fs.readFileSync(tutureYmlPath).toString());
      tuture.steps[0].explain = 'Some Explanation';
      fs.writeFileSync(tutureYmlPath, yaml.safeDump(tuture));

      // Add one more commit.
      fs.createFileSync(path.join(repoPath, 'test4.js'));
      gitRunner(['add', 'test4.js']);
      gitRunner(['commit', '-m', 'Commit 3']);

      it('should have updated diff.json', () => {
        const diffContent = parseDiffJSON(repoPath);
        expect(diffContent).toHaveLength(exampleRepo.length + 1);
      });

      it('should have updated tuture.yml appropriately', () => {
        const newTuture = yaml.safeLoad(
          fs.readFileSync(tutureYmlPath).toString(),
        );
        expect(newTuture.steps).toHaveLength(exampleRepo.length + 1);
        expect(newTuture.steps[0].explain).toBe('Some Explanation');
        expect(newTuture.steps[2].name).toBe('Commit 3');
      });
    });

    describe('amend last commit', () => {
      const repoPath = createGitRepo();
      const tutureRunner = tutureRunnerFactory(repoPath);
      const gitRunner = gitRunnerFactory(repoPath);
      const tutureYmlPath = path.join(repoPath, 'tuture.yml');
      tmpDirs.push(repoPath);

      tutureRunner(['init', '-y']);

      // Write some explanations.
      const tuture = yaml.safeLoad(fs.readFileSync(tutureYmlPath).toString());
      tuture.steps[0].explain = 'Some Explanation';
      fs.writeFileSync(tutureYmlPath, yaml.safeDump(tuture));

      // Amend last commit (revise commit log only).
      gitRunner(['commit', '--amend', '-m', 'Amended commit 2']);

      it('should not have updated diff.json', () => {
        const diffContent = parseDiffJSON(repoPath);
        expect(diffContent).toHaveLength(exampleRepo.length);
      });

      it('should have updated tuture.yml appropriately', () => {
        const newTuture = yaml.safeLoad(
          fs.readFileSync(tutureYmlPath).toString(),
        );
        expect(newTuture.steps).toHaveLength(exampleRepo.length + 1);
        expect(newTuture.steps[0].explain).toBe('Some Explanation');

        // Outdated commit still there.
        expect(newTuture.steps[1].name).toBe('Commit 2');
        expect(newTuture.steps[1].outdated).toBe(true);

        expect(newTuture.steps[2].name).toBe('Amended commit 2');
      });
    });
  });

  describe('manual reload', () => {
    const repoPath = createGitRepo();
    const tutureRunner = tutureRunnerFactory(repoPath) as SyncRunner;
    const tutureYmlPath = path.join(repoPath, 'tuture.yml');
    tmpDirs.push(repoPath);

    tutureRunner(['init', '-y']);

    const tuture = yaml.safeLoad(fs.readFileSync(tutureYmlPath).toString());
    tuture.steps[0].explain = 'Some Explanation';

    const tutureBeforeReload = clonedeep(tuture);
    const diffBeforeReload = parseDiffJSON(repoPath);

    // Remove the last step to see if it can be recovered after reload.
    tuture.steps.pop();
    fs.writeFileSync(tutureYmlPath, yaml.safeDump(tuture));

    // Manually invoke `tuture reload`
    const cp = tutureRunner(['reload']);

    it('should exit with status 0', () => {
      expect(cp.status).toBe(0);
    });

    it('should leave internal files unchanged', () => {
      const diffAfterReload = parseDiffJSON(repoPath);
      expect(diffAfterReload).toStrictEqual(diffBeforeReload);
    });

    it('should complete missing steps in tuture.yml', () => {
      const tutureAfterReload = yaml.safeLoad(
        fs.readFileSync(tutureYmlPath).toString(),
      );
      expect(tutureAfterReload).toStrictEqual(tutureBeforeReload);
    });
  });
});
