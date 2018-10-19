import fs from 'fs-extra';
import path from 'path';
import request from 'request';

import {
  createEmptyDir,
  createGitRepo,
  tutureRunnerFactory,
  SyncRunner,
} from './utils';

// Tmp directories used in tests.
const tmpDirs: string[] = Array();

describe('tuture up', () => {
  afterAll(() => tmpDirs.forEach((dir) => fs.removeSync(dir)));

  describe('normal setup', () => {
    const repoPath = createGitRepo();
    const tutureRunner = tutureRunnerFactory(repoPath, true);
    tmpDirs.push(repoPath);
    tutureRunner(['init', '-y']);

    it('should spin tuture server', () => {
      tutureRunner(['up']);

      // Wait for the server to be fully prepared.
      setTimeout(() => {
        request.get('http://localhost:3000', (err, response, body) => {
          expect(err).toBeUndefined();
          expect(response).not.toBeUndefined();
          expect(response.statusCode).toBe(200);
        });
      }, 200);
    });

    it('should spin server on specified port', () => {
      const testPort = 8000;
      process.env.TEST = 'yes';
      tutureRunner(['up', '-p', `${testPort}`]);

      // Wait for the server to be fully prepared.
      setTimeout(() => {
        request.get(`http://localhost:${testPort}`, (err, response, body) => {
          expect(err).toBeUndefined();
          expect(response).not.toBeUndefined();
          expect(response.statusCode).toBe(200);
        });
      }, 200);
    });
  });

  describe('tuture is not initialized', () => {
    const nonTuturePath = createEmptyDir();
    const tutureRunner = tutureRunnerFactory(nonTuturePath) as SyncRunner;
    tmpDirs.push(nonTuturePath);

    it('should refuse to up', () => {
      const cp = tutureRunner(['up']);
      expect(cp.status).not.toBe(0);
    });
  });

  describe('tuture.yml syntax error', () => {
    const repoPath = createGitRepo();
    const tutureRunner = tutureRunnerFactory(repoPath) as SyncRunner;
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
