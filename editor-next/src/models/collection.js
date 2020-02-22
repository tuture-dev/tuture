import * as F from 'editure-constants';

import { FILE, STEP } from '../utils/constants';

function flatten(steps) {
  return steps.flatMap(({ commit, id, children }) => [
    { commit, id, type: STEP, children: [{ text: '' }] },
    ...children.flatMap((node) => {
      if (node.type === FILE && node.display) {
        const { file } = node;
        return [
          { file, type: FILE, children: [{ text: '' }] },
          ...node.children,
        ];
      }
      return node;
    }),
  ]);
}

function unflatten(fragment) {
  const steps = [{ ...fragment[0], children: [] }];

  for (let i = 1; i < fragment.length; i++) {
    const node = fragment[i];
    if (node.type === STEP) {
      steps.push({ ...node, children: [] });
    } else if (node.type === FILE && node.display) {
      steps
        .slice(-1)[0]
        .children.push({ ...node, children: fragment.slice(i + 1, i + 4) });
      i += 3;
    } else {
      steps.slice(-1)[0].children.push(node);
    }
  }

  return steps;
}

function isHeading(node) {
  return [F.H1, F.H2, F.H3, F.H4, F.H5].includes(node.type);
}

function getHeadingText(node) {
  return node.children.map((child) => child.text).join('');
}

function getHeadings(nodes) {
  return nodes.flatMap((node) => {
    if (isHeading(node)) {
      return { ...node, title: getHeadingText(node) };
    }
    if (node.children) {
      return getHeadings(node.children);
    }
    return [];
  });
}

const collection = {
  state: {
    collection: null,
    nowArticleId: null,
    nowStepCommit: null,
  },
  reducers: {
    setCollectionData(state, payload) {
      state.collection = payload;

      if (payload.articles?.length > 0 && !state.nowArticleId) {
        state.nowArticleId = payload.articles[0].id;
      }

      return state;
    },
    setNowArticle(state, payload) {
      state.nowArticleId = payload;
      state.nowStepCommit = null;

      return state;
    },
    setArticleTitle(state, payload) {
      if (state.collection.articles.length !== 0) {
        state.collection.articles = state.collection.articles.map((article) => {
          if (article.id === state.nowArticleId) {
            article.name = payload;

            return article;
          }

          return article;
        });
      } else {
        state.collection.name = payload;
      }

      return state;
    },
    setArticleDescription(state, payload) {
      if (state.collection.articles.length !== 0) {
        state.collection.articles = state.collection.articles.map((article) => {
          if (article.id === state.nowArticleId) {
            article.description = payload;

            return article;
          }

          return article;
        });
      } else {
        state.collection.description = payload;
      }

      return state;
    },
    setDiffItemHiddenLines(state, payload) {
      const { file, commit, hiddenLines } = payload;

      state.collection.steps = state.collection.steps.map((step) => {
        if (step.commit === commit) {
          step.children = step.children.map((diffFile) => {
            if (diffFile.file === file) {
              diffFile.hiddenLines = hiddenLines;
            }

            return diffFile;
          });
        }

        return step;
      });

      return state;
    },
    switchFile(state, payload) {
      const { removedIndex, addedIndex, commit } = payload;

      state.collection.steps = state.collection.steps.map((step) => {
        if (step.commit === commit) {
          const oldFile = step.children[removedIndex + 2];
          step.children.splice(removedIndex + 2, 1);
          step.children.splice(addedIndex + 2, 0, oldFile);
        }

        return step;
      });
    },
    setArticleContent(state, payload) {
      const { fragment } = payload;

      if (!fragment) return state;

      const newSteps = unflatten(fragment);

      state.collection.steps = state.collection.steps.map(
        (step) =>
          newSteps.filter((node) => node.commit === step.commit)[0] || step,
      );

      return state;
    },
    setNowStepCommit(state, payload) {
      if (payload.commit) {
        state.nowStepCommit = payload.commit;
      }
      return state;
    },
    setFileShowStatus(state, payload) {
      state.collection.steps = state.collection.steps.map((step) => {
        if (step.commit === payload.commit) {
          step.children = step.children.map((file) => {
            if (file.file === payload.file) {
              file.display = payload.display;
            }

            return file;
          });
        }

        return step;
      });

      return state;
    },
  },
  effects: (dispatch) => ({
    async fetchCollection() {
      const response = await fetch(
        `https://tuture-staging-1257259601.cos.ap-shanghai.myqcloud.com/converted-tuture.json`,
      );
      const data = await response.json();
      console.log('data', data);
      dispatch({ type: 'collection/setCollectionData', payload: data });
    },
  }),
  selectors: (slice, createSelector, hasProps) => ({
    nowArticleMeta() {
      return slice((collectionModel) => {
        if (!collectionModel.collection) {
          return null;
        }

        const {
          collection: { articles, name, description },
          nowArticleId,
        } = collectionModel;

        if (nowArticleId) {
          return articles.filter((elem) => elem.id === nowArticleId)[0];
        }

        return { name, description };
      });
    },
    nowArticleContent() {
      return slice((collectionModel) => {
        if (!collectionModel.collection) {
          return [{ type: F.PARAGRAPH, children: [{ text: '' }] }];
        }

        const {
          collection: { articles, steps },
          nowArticleId,
        } = collectionModel;

        if (nowArticleId) {
          const article = articles.filter(
            (elem) => elem.id.toString() === nowArticleId.toString(),
          )[0];
          return flatten(
            steps.filter((step) => article.commits.includes(step.commit)),
          );
        }

        return flatten(steps);
      });
    },
    nowArticleCatalogue() {
      return slice((collectionModel) => {
        if (!collectionModel.collection) {
          return [];
        }

        const {
          collection: { articles, steps },
          nowArticleId,
        } = collectionModel;

        if (nowArticleId) {
          const article = articles.filter(
            (elem) => elem.id.toString() === nowArticleId.toString(),
          )[0];
          return getHeadings(
            steps.filter((step) => article.commits.includes(step.commit)),
          );
        }

        return getHeadings(steps);
      });
    },
    nowStepCommit() {
      return slice((collectionModel) => {
        if (!collectionModel.collection) {
          return null;
        }

        const { articles, steps } = collectionModel.collection;
        return articles?.length > 0 ? articles[0].commits[0] : steps[0].commit;
      });
    },
    getStepFileListAndTitle: hasProps((__, props) => {
      return slice((collectionModel) => {
        if (!collectionModel.collection) {
          return { fileList: [], title: '' };
        }

        const { commit } = props;
        const nowStep = collectionModel.collection.steps.filter(
          (step) => step.commit === commit,
        )[0];

        if (nowStep) {
          const fileList = nowStep.children
            .filter(({ type }) => type === FILE)
            .map(({ file, display = true }) => ({ file, display }));
          return {
            fileList,
            title: getHeadings([nowStep])
              .flat(5)
              .filter((node) => node.commit)[0].title,
          };
        }

        return { fileList: [], title: '' };
      });
    }),
    getCollectionCatalogue() {
      return slice((collectionModel) => {
        if (!collectionModel.collection) {
          return [];
        }

        const getCommitName = (commit) => {
          const steps = collectionModel.collection.steps.filter(
            (step) => step.commit === commit,
          );

          return getHeadings(steps)
            .flat(5)
            .filter((node) => node.commit)[0].title;
        };

        const getCommitArrName = (commitArr) => {
          const commitArrWithName = commitArr.map((commit) => ({
            commit,
            name: getCommitName(commit),
          }));

          return commitArrWithName;
        };

        const { articles = [] } = collectionModel.collection;

        const collectionCatalogue = articles.map((article) => ({
          ...article,
          commitArrWithName: getCommitArrName(article.commits),
        }));

        return collectionCatalogue;
      });
    },
  }),
};

export default collection;
