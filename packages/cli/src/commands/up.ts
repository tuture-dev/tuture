import open from 'open';
import fs from 'fs-extra';
import getPort from 'get-port';
import { Command } from 'commander';
import { makeServer } from '@tuture/local-server';

// import reload from './reload';
import logger from '../utils/logger.js';
import { shouldReloadSteps } from '../utils/git.js';

async function fireTutureServer() {
  const port = await getPort();
  const server = makeServer({
    baseUrl: '/api',
    // onGitHistoryChange: () => {
    //   reload.run([]);
    // },
  });

  server.listen(port, () => {
    const url = `http://localhost:${port}`;
    logger.log('success', `Tutorial editor is served on ${url}`);

    // Don't open browser in test environment.
    if (process.env.TEST !== 'yes') {
      setTimeout(() => open(url), 500);
      // open(url);
    }
  });
}

export async function doUp() {
  // this.userConfig = Object.assign(this.userConfig, flags);

  // Run sync command if workspace is not prepared.
  // if (
  //   !fs.existsSync(collectionPath) ||
  //   !fs.existsSync(diffPath) ||
  //   (await shouldReloadSteps())
  // ) {
  //   await reload.run([]);
  // }

  fireTutureServer();
}

export function makeUpCommand() {
  const up = new Command('up');

  up.description('start editor server')
    .option('-p, --port', 'which port to use for editor server')
    .action(doUp);

  return up;
}
