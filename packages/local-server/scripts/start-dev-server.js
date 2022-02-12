import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import simplegit from 'simple-git/promise.js';

import { makeServer } from '../dist/index.js';
import { makeInitCommand } from '../../cli/dist/commands/init.js';
import mockRemotes from '../fixtures/mock-remotes.json';

async function prepareTempDir(prefix) {
  return await fs.mkdtemp(path.join(os.tmpdir(), prefix));
}

async function prepareTutureDir() {
  const tmpRoot = await prepareTempDir('tuture-root-');
  console.log('tmpRoot:', tmpRoot);
  process.env.TUTURE_PATH = tmpRoot;

  const tmpCollection = await prepareTempDir('tuture-collection-');
  console.log('tmpCollection:', tmpCollection);
  process.chdir(tmpCollection);

  const git = simplegit(tmpCollection);
  await git.init();

  fs.writeFileSync('a.js', 'console.log("hello");\n');
  await git.add('.');
  await git.commit('first commit');

  fs.writeFileSync('a.js', 'console.log("hello");\nconsole.log("world");\n');
  await git.add('.');
  await git.commit('second commit');

  await makeInitCommand().parseAsync(['tuture', 'init', '-y']);
}

async function startDevServer() {
  await prepareTutureDir();

  const PORT = 8000;

  const app = makeServer({
    baseUrl: '/api',

    // 以下路由会覆盖原始的路由，便于测试
    mockRoutes: (app) => {
      app.get('/api/remotes', (req, res) => {
        res.json(mockRemotes);
      });

      app.get('/api/sync', (req, res) => {
        setTimeout(() => {
          res.sendStatus(200);
        }, 2000);
      });
    },
  });

  app.listen(PORT, () => {
    console.log(`API server is running on http://localhost:${PORT}!`);
  });
}

startDevServer();
