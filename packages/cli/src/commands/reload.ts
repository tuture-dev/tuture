import debug from 'debug';
import { Command } from 'commander';
import * as Y from 'yjs';
import { prosemirrorJSONToYDoc } from 'y-prosemirror';
import { tutureSchema, includeCommit } from '@tuture/core';
import {
  getCollectionDb,
  getDocPersistence,
  getYDoc,
  LeveldbPersistence,
} from '@tuture/local-server';

import { initNodes } from '../utils/index.js';
import logger from '../utils/logger.js';

const d = debug('tuture:cli:reload');

type ReloadOptions = {
  // if true, reload will be done for doc in local server memory
  online: boolean;
};

let persistence: LeveldbPersistence | null;

export async function doReload(options: ReloadOptions) {
  d('cwd: %s', process.cwd());
  d('options: %o', options);

  const currentNodes = await initNodes();
  const currentCommits = currentNodes
    .filter((node) => node.type === 'step_start')
    .map((node) => node.attrs?.commit);
  d('currentCommits: %o', currentCommits);

  const currentDoc = prosemirrorJSONToYDoc(tutureSchema, {
    type: 'doc',
    content: currentNodes,
  });
  const elements = currentDoc
    .getXmlFragment('prosemirror')
    .toArray() as Y.XmlElement[];
  for (let i = 0; i < elements.length; i++) {
    elements[i].doc = null;
  }
  d(
    'current elements: %O',
    elements.map((element) => element.toJSON()),
  );

  if (!options.online) {
    persistence = getDocPersistence();
  }

  const previousCommits = new Set<string>();

  const db = getCollectionDb();
  const { articles } = db.data!;
  d('articles: %o', articles);

  await Promise.all(
    articles.map(async (article, index) => {
      const ydoc = options.online
        ? getYDoc(article.id)
        : await persistence.getYDoc(article.id);
      const fragment = ydoc.getXmlFragment('prosemirror');
      d('fragment for article %s: %o', article.id, fragment.toJSON());

      ydoc.transact(() => {
        // mark outdated nodes (belonging commit no longer exists)
        fragment.toArray().forEach((element) => {
          // don't care about texts or hooks
          if (element instanceof Y.XmlText || element instanceof Y.XmlHook) {
            return;
          }
          const topNodes = [
            'step_start',
            'step_end',
            'file_start',
            'file_end',
            'explain',
            'heading',
          ];
          if (topNodes.includes(element.nodeName)) {
            const commit = element.getAttribute('commit');
            if (commit) {
              if (!includeCommit(currentCommits, commit)) {
                d('outdated node: %o', element.toJSON());
                element.setAttribute('outdated', 'true');
              } else {
                previousCommits.add(commit);
              }
            }
          }
        });
      });

      d('previousCommits: %o', previousCommits);

      // for the last article, add new steps
      if (index === articles.length - 1) {
        currentCommits.forEach((commit) => {
          if (!previousCommits.has(commit)) {
            d('start to insert nodes for commit: %s', commit);
            const startIndex = elements.findIndex(
              (element) =>
                element.nodeName === 'step_start' &&
                element.getAttribute('commit') === commit,
            );
            const endIndex = elements.findIndex(
              (element) =>
                element.nodeName === 'step_end' &&
                element.getAttribute('commit') === commit,
            );
            const elementsSlice = elements
              .slice(startIndex, endIndex + 1)
              .map((element) => element.clone() as Y.XmlElement);
            d('insert elements slice %O', elementsSlice);

            fragment.push(elementsSlice);
          }
        });
      }

      if (!options.online) {
        const newUpdates = Y.encodeStateAsUpdate(ydoc);
        persistence.storeUpdate(article.id, newUpdates);
      }
    }),
  );

  // TODO: clean out ignored files, set display to false for those nodes.

  logger.log('success', 'Reload complete!');
}

export function makeReloadCommand() {
  const reload = new Command('reload');
  reload
    .description('update workspace with latest git history')
    .option('--online', 'reload for doc in local server memory')
    .action(async () => {
      await doReload(reload.opts<ReloadOptions>());
    });

  return reload;
}
