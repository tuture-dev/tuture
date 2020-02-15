import {
  STEP_PRE_EXPLAIN,
  STEP_POST_EXPLAIN,
  DIFF_PRE_EXPLAIN,
  DIFF_POST_EXPLAIN,
} from '../utils/constants';

const collection = {
  state: {
    diff: [],
    collection: {
      articles: [],
    },
    nowArticle: {},
  },
  reducers: {
    setCollectionData(state, payload) {
      const { tuture, diff } = payload;
      state.diff = diff;
      state.nowArticle = tuture;
      state.collection = { ...state.collection, ...tuture };

      return state;
    },
    setArticleTitle(state, payload) {
      state.nowArticle.name = payload;

      if (state.collection.articles.length !== 0) {
        state.collection.articles = state.collection.articles.map((article) => {
          if (article.id === state.nowArticle.id) {
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
      state.nowArticle.description = payload;

      state.collection.description = payload;

      return state;
    },
    setStepTitle(state, payload) {
      const { commit, value } = payload;

      state.nowArticle.steps = state.nowArticle.steps.map((step) => {
        if (step.commit === commit) {
          step.name = value;

          return step;
        }

        return step;
      });
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

      // set nowArticle
      state.nowArticle.steps = state.nowArticle.steps.map((step) => {
        if (step.commit === commit) {
          if (step.explain) {
            step.explain[mapConstantToType[type]] = content;
          } else {
            step.explain = { [mapConstantToType[type]]: content };
          }
        }

        return step;
      });

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
      const {
        commit, content, file, type,
      } = payload;

      const mapConstantToType = {
        [DIFF_PRE_EXPLAIN]: 'pre',
        [DIFF_POST_EXPLAIN]: 'post',
      };

      // set nowArticle
      state.nowArticle.steps = state.nowArticle.steps.map((step) => {
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

      // set collection
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
  },
};

export default collection;
