import { Router } from 'express';
import * as Y from 'yjs';

import { TocStepItem, TocArticleItem, TocItem } from '../types';
import { loadCollection, saveCollection } from '../utils/collection';
import {
  getCollectionDb,
  getDocPersistence,
  LeveldbPersistence,
} from '../utils/index.js';

interface TocUpdateBody {
  articleStepList: TocItem[];
  unassignedStepList: TocStepItem[];
}

type IArticle = {
  id: string;
  name: string;
};

type ICommit = {
  id: string;
  name: string;
};

type IFile = {
  id: string;
  name: string;
};

type IArticleCommitMap = {
  [articleId: string]: ICommit[];
};

type ICommitFileMap = {
  [commitId: string]: IFile[];
};

const router = Router();

router.get('/', async (req, res) => {
  let persistence = getDocPersistence();
  const db = getCollectionDb(req.params.collectionId);
  const { articles = [] } = db.data!;

  let resObj = {
    // 所有的文章
    articles: [] as IArticle[],
    articleCommitMap: {} as IArticleCommitMap,
    commitFileMap: {} as ICommitFileMap,
  };
  let testRes = [] as any;

  articles.forEach((article) =>
    resObj.articles.push({
      id: article.id,
      name: article.name,
    }),
  );

  await Promise.all(
    articles.map(async (article, index) => {
      const ydoc = await persistence.getYDoc(article.id);
      const fragment = ydoc.getXmlFragment('prosemirror');

      let oneArticleCommit = {} as ICommit;
      let oneCommitFile = {} as IFile;

      ydoc.transact(() => {
        fragment.toArray().forEach((element) => {
          if (element instanceof Y.XmlText || element instanceof Y.XmlHook) {
            return;
          }

          console.log('element', element.nodeName);

          switch (element.nodeName) {
            case 'step_start': {
              const commit = element.getAttribute('commit');
              oneArticleCommit['commit'] = commit;
              oneArticleCommit['articleId'] = article.id;

              break;
            }

            case 'heading': {
              const name = element.firstChild?.toJSON();
              const id = element.getAttribute('id');
              const level = element.getAttribute('level');

              oneArticleCommit['id'] = id;
              oneArticleCommit['level'] = level;
              oneArticleCommit['name'] = name;

              break;
            }

            case 'file_start': {
              const file = element.getAttribute('file');

              oneCommitFile['file'] = file;

              break;
            }

            case 'file_end': {
              const commit = element.getAttribute('commit');

              if (
                resObj.commitFileMap[commit] &&
                Array.isArray(resObj.commitFileMap[commit])
              ) {
                resObj.commitFileMap[commit].push(oneCommitFile);
              } else {
                resObj.commitFileMap[commit] = [];
                resObj.commitFileMap[commit].push(oneCommitFile);
              }

              // 一次 File 遍历结束，置空此对象
              oneCommitFile = {} as IFile;

              break;
            }

            case 'step_end': {
              if (
                resObj.articleCommitMap[article.id] &&
                Array.isArray(resObj.articleCommitMap[article.id])
              ) {
                resObj.articleCommitMap[article.id].push(oneArticleCommit);
              } else {
                resObj.articleCommitMap[article.id] = [];
                resObj.articleCommitMap[article.id].push(oneArticleCommit);
              }

              // 一次 Commit 遍历结束，置空此对象
              oneArticleCommit = {} as ICommit;

              break;
            }

            default: {
              // 其他节点不进行处理
            }
          }
        });
      });
    }),
  );

  // for (let article of articles) {
  //   const articleItem: TocArticleItem = {
  //     ...article,
  //     type: 'article',
  //   };
  //   articleStepList.push(articleItem);

  //   for (let step of article.steps) {
  //     const stepDoc = loadStepSync(step.id);
  //     const stepItem: TocStepItem = {
  //       type: 'step',
  //       ...stepDoc.attrs,
  //     };
  //     articleStepList.push(stepItem);
  //   }
  // }

  // for (let step of unassignedSteps) {
  //   const stepDoc = loadStepSync(step.id);
  //   const stepItem: TocStepItem = {
  //     type: 'step',
  //     ...stepDoc.attrs,
  //   };
  //   unassignedStepList.push(stepItem);
  // }

  res.json({ res: resObj });
});

// 直接通过修改 ydoc 的方式，然后实现 ydoc 同步 Prosemirror
router.put('/', (req, res) => {
  const {
    articleStepList = [],
    unassignedStepList = [],
  }: TocUpdateBody = req.body;

  // const collection = loadCollection();
  // const articles = collection.articles;
  // for (let i = 0; i < articles.length; i++) {
  //   articles[i].steps = [];
  // }

  // articleStepList.forEach((articleStep) => {
  //   if (articleStep.type === 'step') {
  //     for (let i = 0; i < articles.length; i++) {
  //       if (articles[i].id === articleStep.articleId) {
  //         articles[i].steps.push({
  //           id: articleStep.id,
  //           commit: articleStep.commit,
  //         });
  //       }
  //     }
  //   }
  // });

  // collection.unassignedSteps = unassignedStepList.map((step) => ({
  //   id: step.id,
  //   commit: step.commit,
  // }));

  // saveCollection(collection);

  res.sendStatus(200);
});

export default router;
