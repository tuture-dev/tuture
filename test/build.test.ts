import fs from 'fs-extra';
import path from 'path';

import { createEmptyDir, tutureRunnerFactory, SyncRunner } from './utils';
import { DIFF_PATH, TUTURE_YML_PATH, TUTURE_ROOT } from '../constants';

// Tmp directories used in tests.
const tmpDirs: string[] = Array();

const testDiffJSON = `[
  {
    "commit": "139f13c",
    "diff": [
      {
        "chunks": [
          {
            "content": "@@ -0,0 +1,2 @@",
            "changes": [
              {
                "type": "add",
                "add": true,
                "ln": 1,
                "content": "+console.log('Test');"
              },
              { "type": "add", "add": true, "ln": 2, "content": "+" }
            ],
            "oldStart": 0,
            "oldLines": 0,
            "newStart": 1,
            "newLines": 2
          }
        ],
        "deletions": 0,
        "additions": 2,
        "from": "/dev/null",
        "to": "test1.js",
        "new": true,
        "index": ["0000000..e260351"]
      }
    ]
  },
  {
    "commit": "829f330",
    "diff": [
      {
        "chunks": [
          {
            "content": "@@ -0,0 +1,2 @@",
            "changes": [
              {
                "type": "add",
                "add": true,
                "ln": 1,
                "content": "+print('Test')"
              },
              { "type": "add", "add": true, "ln": 2, "content": "+" }
            ],
            "oldStart": 0,
            "oldLines": 0,
            "newStart": 1,
            "newLines": 2
          }
        ],
        "deletions": 0,
        "additions": 2,
        "from": "/dev/null",
        "to": "test2.py",
        "new": true,
        "index": ["0000000..cf323a9"]
      }
    ]
  }
]
`;

const testTutureYML = `name: My Awesome Tutorial
id: 70cb2a2c41ba87cf9938b22bb6df23d8
description: This is a test tutorial.
steps:
  - name: Commit 1
    commit: 139f13c
    explain:
      pre: This is pre-explain for step 1.
      post: This is post-explain for step 1.
    diff:
      - file: test1.js
        explain:
          pre: This is pre-explain for test1.js.
          post: This is post-explain for test1.js.
        display: true
  - name: Commit 2
    commit: 829f330
    explain:
      pre: This is pre-explain for step 2.
      post: This is post-explain for step 2.
    diff:
      - file: test2.py
        explain:
          pre: This is pre-explain for test2.py.
          post: This is post-explain for test2.py.
        display: true
`;

const expectedOutput = `# My Awesome Tutorial

This is a test tutorial.

## Commit 1

This is pre-explain for step 1.

This is pre-explain for test1.js.

\`\`\`js test1.js
console.log('Test');

\`\`\`

This is post-explain for test1.js.

This is post-explain for step 1.

## Commit 2

This is pre-explain for step 2.

This is pre-explain for test2.py.

\`\`\`py test2.py
print('Test')

\`\`\`

This is post-explain for test2.py.

This is post-explain for step 2.`;

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
