import debug from 'debug';
import { Command } from 'commander';
import { EditorState } from 'prosemirror-state';
import { Fragment, Node } from 'prosemirror-model';
import { ySyncPlugin, yDocToProsemirror } from 'y-prosemirror';
import { tutureSchema, includeCommit } from '@tuture/core';
import { getCollectionDb, getDocPersistence } from '@tuture/local-server';

import { initNodes } from '../utils/index.js';
import logger from '../utils/logger.js';

const d = debug('tuture:cli:reload');

type ReloadOptions = {};

async function doReload(options: ReloadOptions) {
  d('cwd: %s', process.cwd());
  d('options: %o', options);

  const currentNodes = await initNodes();
  const currentCommits = currentNodes
    .filter((node) => node.type === 'step_start')
    .map((node) => node.attrs?.commit);
  d('currentCommits: %o', currentCommits);

  const previousCommits = new Set<string>();

  const persistence = getDocPersistence();
  const db = await getCollectionDb();
  const { articles } = db.data!;
  d('articles: %o', articles);

  await Promise.all(
    articles.map(async (article, index) => {
      const ydoc = await persistence.getYDoc(article.id);
      const state = EditorState.create({
        schema: tutureSchema,
        doc: yDocToProsemirror(tutureSchema, ydoc),
        plugins: [ySyncPlugin(ydoc.getXmlFragment('prosemirror'))],
      });
      d('doc before reload: %O', state.doc.content.toJSON());

      let tr = state.tr;

      // mark outdated nodes (belonging commit no longer exists)
      state.doc.content.descendants((node, pos) => {
        switch (node.type.name) {
          case 'step_start':
          case 'step_end':
          case 'file_start':
          case 'file_end':
          case 'explain':
            if (!includeCommit(currentCommits, node.attrs.commit)) {
              d('outdated node: %o', node);
              tr = tr.setBlockType(pos, pos + node.nodeSize, node.type, {
                ...node.attrs,
                outdated: true,
              });
            } else {
              previousCommits.add(node.attrs.commit);
            }
            break;
          case 'heading':
            if (
              node.attrs.step?.commit &&
              !includeCommit(currentCommits, node.attrs.step?.commit)
            ) {
              d('outdated heading: %o', node);
              tr = tr.setBlockType(pos, pos + node.nodeSize, node.type, {
                ...node.attrs,
                outdated: true,
              });
            }
            break;
        }
      });
      d('previousCommits: %o', previousCommits);

      // for the last article, add new steps
      if (index === articles.length - 1) {
        currentCommits.forEach((commit) => {
          if (!previousCommits.has(commit)) {
            const startIndex = currentNodes.findIndex(
              (node) =>
                node.type === 'step_start' && node.attrs.commit === commit,
            );
            const endIndex = currentNodes.findIndex(
              (node) =>
                node.type === 'step_end' && node.attrs.commit === commit,
            );
            const fragment = Fragment.fromJSON(
              tutureSchema,
              currentNodes.slice(startIndex, endIndex + 1),
            );
            d(
              'insert new fragment (index from %o to %o): %o',
              startIndex,
              endIndex,
              fragment.toJSON(),
            );

            tr = tr.insert(state.doc.content.size, fragment);
          }
        });
      }

      state.applyTransaction(tr);
    }),
  );

  // TODO: clean out ignored files, set display to false for those nodes.

  logger.log('success', 'Reload complete!');
}

export function makeReloadCommand() {
  const reload = new Command('reload');
  reload
    .description('update workspace with latest git history')
    .action(async () => {
      await doReload(reload.opts<ReloadOptions>());
    });

  return reload;
}
