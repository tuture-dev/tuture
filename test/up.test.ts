import fs from 'fs-extra';
import { ChildProcess } from 'child_process';
import path from 'path';
import request from 'request';

import {
  createEmptyDir,
  createGitRepo,
  tutureRunnerFactory,
  SyncRunner,
  AsyncRunner,
} from './utils';

// Tmp directories used in tests.
const tmpDirs: string[] = Array();

// Subprocesses used in test (need to be killed in the end).
const procs: ChildProcess[] = Array();

describe('tuture up', () => {
  beforeAll(() => {
    // Add mock editor required by tuture server.
    const mockEditorPage = '<html>Mock Editor</html>';
    fs.mkdirSync(path.join('build', 'editor'));
    fs.writeFileSync(
      path.join('build', 'editor', 'index.html'),
      mockEditorPage,
    );
  });

  afterAll(() => {
    tmpDirs.forEach((dir) => fs.removeSync(dir));
    procs.forEach((proc) => proc.kill('SIGINT'));
  });

  describe('normal setup', () => {
    const repoPath = createGitRepo();
    const tutureRunner = tutureRunnerFactory(repoPath, true) as AsyncRunner;
    tmpDirs.push(repoPath);
    procs.push(tutureRunner(['init', '-y']));

    // Ensure we don't open browser in test environment.
    process.env.TEST = 'yes';

    it('should spin tuture server', () => {
      procs.push(tutureRunner(['up']));

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
      procs.push(tutureRunner(['up', '-p', `${testPort}`]));

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
