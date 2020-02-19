import * as F from 'editure-constants';

import { FILE, STEP } from '../utils/constants';
import diff from '../utils/data/diff.json';
import tuture from '../utils/data/converted-tuture.json';

function flatten(steps) {
  return steps
    .map(({ name, commit, children }) => [
      { name, commit, type: STEP, children: [{ text: '' }] },
      ...children,
    ])
    .reduce((a, b) => a.concat(b));
}

function unflatten(fragment) {
  const steps = [{ ...fragment[0], children: [] }];

  for (const node of fragment.slice(1)) {
    if (node.type === STEP) {
      steps.push({ ...node, children: [] });
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
  return nodes
    .map((node) => {
      if (isHeading(node)) {
        return { ...node, title: getHeadingText(node) };
      }
      if (node.children) {
        return getHeadings(node.children);
      }
      return null;
    })
    .filter((node) => node);
}

const collection = {
  state: {
    diff,
    collection: tuture,
    nowArticleId: tuture.articles[0].id,
    nowStepCommit: '372a021',
  },
  reducers: {
    setCollectionData(state, payload) {
      state.diff = payload.diff;
      state.collection = { ...state.collection, ...payload.tuture };
      state.nowStepCommit = payload.tuture.steps[0].commit;

      if (state.collection.articles?.length > 0) {
        state.nowArticleId = state.collection.articles[0].id;
        state.nowStepCommit = state.collection.articles[0].commits.slice(-1)[0];
      }

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
    setStepTitle(state, payload) {
      const { commit, value } = payload;

      state.collection.steps = state.collection.steps.map((step) => {
        if (step.commit === commit) {
          step.name = value;

          return step;
        }

        return step;
      });

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
          const preExplain = step.children[0];
          const postExplain = step.children.slice(-1)[0];
          const fileList = step.children.slice(1, -1);

          const oldFile = fileList[removedIndex];
          fileList.splice(removedIndex, 1);
          fileList.splice(addedIndex, 0, oldFile);

          step.children = [preExplain, ...fileList, postExplain];
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
      state.nowStepCommit = payload;
    },
  },
  selectors: (slice, createSelector, hasProps) => ({
    nowArticleMeta() {
      return slice((collectionModel) => {
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
          ).flat(5);
        }

        return getHeadings(steps).flat(5);
      });
    },
    getDiffItemByCommitAndFile: hasProps((__, props) => {
      return slice(
        (collectionModel) =>
          collectionModel.diff
            .filter((diffItem) => diffItem.commit === props.commit)[0]
            .diff.filter((diffItem) => diffItem.to === props.file)[0],
      );
    }),
    getStepFileListAndTitle: hasProps((__, props) => {
      return slice((collectionModel) => {
        const { commit } = props;
        const nowStep = collectionModel.collection.steps.filter(
          (step) => step.commit === commit,
        )[0];

        if (nowStep) {
          const fileList = nowStep.children
            .filter(({ type }) => type === FILE)
            .map(({ file }) => file);
          return { fileList, title: nowStep.name };
        }

        return { fileList: [], title: '' };
      });
    }),
  }),
};

export default collection;
