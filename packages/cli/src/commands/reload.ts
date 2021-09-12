import fs from 'fs-extra';
import { flags } from '@oclif/command';
import { INode, includeCommit } from '@tuture/core';
import { collectionPath, saveArticle } from '@tuture/local-server';

import sync from './sync';
import BaseCommand from '../base';
import { git } from '../utils/git';
import logger from '../utils/logger';
import { initNodes, loadArticleDocs } from '../utils';
import { getNodeText, isStepTitle, readCommitsFromNodes } from '../utils/node';

export default class Reload extends BaseCommand {
  static description = 'Update workspace with latest commit history';

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  async run() {
    this.parse(Reload);

    // Run sync command if workspace is not created.
    if (!fs.existsSync(collectionPath)) {
      await sync.run([]);
    }

    const collectionDocs = loadArticleDocs();
    const collectionCommits = readCommitsFromNodes(
      collectionDocs.flatMap((articleDoc) => articleDoc.doc.content!),
    );

    await git.checkout('master');

    const ignoredFiles: string[] = this.userConfig.ignoredFiles;
    const currentNodes = await initNodes(ignoredFiles);
    const currentCommits = readCommitsFromNodes(currentNodes);

    // Mark outdated nodes whose commit no longer exists
    collectionDocs.forEach((articleDocs) => {
      const nodes: INode[] = articleDocs.doc.content!;
      for (let i = 0; i < nodes.length; i++) {
        const commit = nodes[i].attrs!.commit;
        if (
          nodes[i].type === 'step_start' &&
          !includeCommit(currentCommits, commit)
        ) {
          while (nodes[i].type !== 'step_end') {
            if (isStepTitle(nodes[i])) {
              logger.log(
                'warning',
                `Outdated step: ${getNodeText(nodes[i])} (${commit})`,
              );
            }
            nodes[i].attrs = { ...nodes[i].attrs, outdated: true };
            i++;
          }
          nodes[i].attrs = { ...nodes[i].attrs, outdated: true };
        }
      }
    });

    // Add new nodes to last article
    const lastArticle = collectionDocs[collectionDocs.length - 1];
    const docContent: INode[] = lastArticle.doc.content || [];
    for (let i = 0; i < currentNodes.length; i++) {
      const commit = currentNodes[i].attrs!.commit;
      if (
        currentNodes[i].type === 'step_start' &&
        !includeCommit(collectionCommits, commit)
      ) {
        while (currentNodes[i].type !== 'step_end') {
          if (isStepTitle(currentNodes[i])) {
            logger.log(
              'success',
              `New step: ${getNodeText(currentNodes[i])} (${commit})`,
            );
          }
          docContent.push(currentNodes[i]);
          i++;
        }
        docContent.push(currentNodes[i]);
      }
    }

    // TODO: clean out ignored files, set display to false for those nodes.

    collectionDocs.forEach((articleDoc) =>
      saveArticle(articleDoc.articleId, articleDoc.doc),
    );

    logger.log('success', 'Reload complete!');
  }
}
