import {
  STEP_PRE_EXPLAIN,
  STEP_POST_EXPLAIN,
  DIFF_PRE_EXPLAIN,
  DIFF_POST_EXPLAIN,
} from '../utils/constants';

import diff from '../utils/data/diff.json';
import tuture from '../utils/data/converted-tuture.json';

const collection = {
  state: {
    diff,
    collection: tuture,
    nowArticleId: tuture.articles[0].id,
    nowCommit: '2b84923',
  },
  reducers: {
    setCollectionData(state, payload) {
      state.diff = payload.diff;
      state.collection = { ...state.collection, ...payload.tuture };

      if (state.collection.articles?.length > 0) {
        state.nowArticleId = state.collection.articles[0].id;
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
    setStepExplain(state, payload) {
      const { commit, content, type } = payload;

      const mapConstantToType = {
        [STEP_PRE_EXPLAIN]: 'pre',
        [STEP_POST_EXPLAIN]: 'post',
      };

      state.collection.steps = state.collection.steps.map((step) => {
        if (step.commit === commit) {
          if (step.explain) {
            step.explain[mapConstantToType[type]] = content;
          } else {
            step.explain = { [mapConstantToType[type]]: content };
          }
        }

        return step;
      });

      return state;
    },
    setDiffFileExplain(state, payload) {
      const { commit, content, file, type } = payload;

      const mapConstantToType = {
        [DIFF_PRE_EXPLAIN]: 'pre',
        [DIFF_POST_EXPLAIN]: 'post',
      };

      state.collection.steps = state.collection.steps.map((step) => {
        if (step.commit === commit) {
          step.diff = step.diff.map((diffFile) => {
            if (diffFile.file === file) {
              if (diffFile.explain) {
                diffFile.explain[mapConstantToType[type]] = content;
              } else {
                diffFile.explain = { [mapConstantToType[type]]: content };
              }
            }

            return diffFile;
          });
        }

        return step;
      });

      return state;
    },
    setDiffItemHiddenLines(state, payload) {
      const { file, commit, hiddenLines } = payload;

      state.collection.steps = state.collection.steps.map((step) => {
        if (step.commit === commit) {
          step.diff = step.diff.map((diffFile) => {
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
          const oldDiff = step.diff[removedIndex];
          step.diff.splice(removedIndex, 1);
          step.diff.splice(addedIndex, 0, oldDiff);
        }

        return step;
      });
    },
    setArticleContent(state, payload) {
      const { fragment } = payload;

      if (!fragment) return state;

      state.collection.steps = state.collection.steps.map(
        (step) =>
          fragment.filter((node) => node.commit === step.commit)[0] || step,
      );

      return state;
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
          return steps.filter((step) => article.commits.includes(step.commit));
        }

        return steps;
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
          const fileList = nowStep.diff.map((diffFile) => diffFile.file);
          return { fileList, title: nowStep.name };
        }

        return { fileList: [], title: '' };
      });
    }),
  }),
};

export default collection;
