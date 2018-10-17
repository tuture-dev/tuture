import fs from 'fs-extra';
import mm from 'micromatch';
import path from 'path';
import yaml from 'js-yaml';

import {
  Commit,
  exampleRepo,
  createEmptyDir,
  createGitRepo,
  parseDiffJSON,
  tutureRunnerFactory,
} from './utils';
import defaultConfig, {
  TUTURE_ROOT,
  DIFF_PATH,
  TUTURE_YML_PATH,
} from '../config';
import { Tuture } from '../types';

// Tmp directories used in tests.
const tmpDirs: string[] = Array();

describe('tuture init -y', () => {
  afterAll(() => tmpDirs.forEach((dir) => fs.removeSync(dir)));

  describe('outside a git repo', () => {
    const nonRepoPath = createEmptyDir();
    const tutureRunner = tutureRunnerFactory(nonRepoPath);
    tmpDirs.push(nonRepoPath);

    const cp = tutureRunner(['init', '-y']);

    it('should exit with status 0', () => {
      expect(cp.status).toBe(0);
    });

    it('should have all needed files created', () => {
      expect(fs.existsSync(path.join(nonRepoPath, TUTURE_YML_PATH))).toBe(true);
      expect(fs.existsSync(path.join(nonRepoPath, DIFF_PATH))).toBe(true);
    });
  });

  describe('inside a Git repo', () => {
    describe('no .gitignore', () => {
      testInit();
    });

    describe('.gitignore without ignoring .tuture', () => {
      // NOTE: When contriving testRepo, put `files` in alphabetic order.
      const testRepo = [
        {
          message: 'Test',
          files: ['.gitignore', 'app.js'],
        },
        {
          message: 'Another Test',
          files: ['dir/test1.js', 'dir/test2.lock'],
        },
        {
          message: 'Still Another Test',
          files: ['dir/test3.js'],
        },
      ];
      testInit(testRepo);
    });

    describe('.gitignore already having .tuture ignored', () => {
      const testRepo = [
        {
          message: 'First Commit',
          files: ['.gitignore', 'test1.js'],
        },
        {
          message: 'Second Commit',
          files: ['test2.js'],
        },
      ];
      testInit(testRepo, true);
    });

    describe('have commits with messages starting with "tuture:"', () => {
      const testRepo = [
        {
          message: 'Do something',
          files: ['bar.js', 'foo.js'],
        },
        {
          message: 'tuture: Ignore this commit',
          files: ['foobar.js'],
        },
        {
          message: 'Do some other thing',
          files: ['index.html'],
        },
      ];
      testInit(testRepo);
    });
  });
});

function testInit(testRepo = exampleRepo, ignoreTuture = false) {
  const repoPath = createGitRepo(testRepo, ignoreTuture);
  const tutureRunner = tutureRunnerFactory(repoPath);
  tmpDirs.push(repoPath);

  // Remove commits with commit messages starting with `tuture:`.
  const expectedRepo = testRepo.filter(
    (commit) => !commit.message.startsWith('tuture:'),
  );

  const cp = tutureRunner(['init', '-y']);

  it('should exit with status 0', () => {
    expect(cp.status).toBe(0);
  });

  it('should create valid diff.json', () => {
    const diffContent = parseDiffJSON(repoPath);
    expect(diffContent).toHaveLength(expectedRepo.length);
    expect(diffContent[0]).toHaveProperty('commit');
    expect(diffContent[0]).toHaveProperty('diff');
  });

  it('should create correct tuture.yml with default values', () => {
    const tutureYmlPath = path.join(repoPath, 'tuture.yml');
    expect(fs.existsSync(tutureYmlPath)).toBe(true);

    const tuture = yaml.safeLoad(fs.readFileSync(tutureYmlPath).toString());
    testTutureObject(tuture, expectedRepo);
  });

  it('should have .gitignore properly configured', () => {
    const gitignorePath = path.join(repoPath, '.gitignore');
    expect(fs.existsSync(gitignorePath)).toBe(true);

    const ignoreRules = fs.readFileSync(gitignorePath).toString();

    // .tuture is ignored.
    expect(ignoreRules).toContain(TUTURE_ROOT);

    // .tuture is ignored only once.
    expect(ignoreRules.indexOf(TUTURE_ROOT)).toBe(
      ignoreRules.lastIndexOf(TUTURE_ROOT),
    );
  });
}

function testTutureObject(tuture: Tuture, expectedRepo: Commit[]) {
  expect(tuture.name).toBe('My Awesome Tutorial');
  expect(tuture.steps).toHaveLength(expectedRepo.length);

  const steps = tuture.steps;

  // Check equivalence of each step.
  for (let i = 0; i < steps.length; i += 1) {
    expect(steps[i].name).toBe(expectedRepo[i].message);
    expect(steps[i].diff).toHaveLength(expectedRepo[i].files.length);

    for (let j = 0; j < expectedRepo[i].files.length; j += 1) {
      expect(steps[i].diff[j].file).toBe(expectedRepo[i].files[j]);

      const file = steps[i].diff[j].file;
      if (
        !defaultConfig.ignoredFiles.some((pattern) => mm.isMatch(file, pattern))
      ) {
        expect(steps[i].diff[j].display).toBe(true);
      }
    }
  }
}
