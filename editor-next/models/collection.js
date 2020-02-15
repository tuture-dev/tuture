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
    nowArticleIndex: {},
  },
  reducers: {
    setCollectionData(state, payload) {
      const { tuture, diff } = payload;
      state.diff = diff;
      state.collection = { ...state.collection, ...tuture };

      if (state.collection.articles.length > 0) {
        state.nowArticleIndex = {
          type: 'article',
          articleId: state.collection.articles[0].id,
        };
      } else {
        state.nowArticleIndex = {
          type: 'collection',
        };
      }

      return state;
    },
    setArticleTitle(state, payload) {
      if (state.collection.articles.length !== 0) {
        state.collection.articles = state.collection.articles.map((article) => {
          if (article.id === state.nowArticleIndex.articleId) {
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
          if (article.id === state.nowArticleIndex.articleId) {
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
  },
  selectors: (slice) => ({
    nowArticle() {
      return slice((collectionModel) => {
        let nowArticle = {};

        const type = collectionModel.nowArticleIndex?.type;
        if (type === 'collection') {
          nowArticle = collectionModel.collection;
        } else if (type === 'article') {
          const articleId = collectionModel.nowArticleIndex?.articleId;
          const targetArticle = collectionModel.collection.articles.filter(
            (article) => article.id === articleId,
          )[0];

          nowArticle = {
            ...targetArticle,
            steps: collectionModel.collection.steps.filter((step) =>
              targetArticle.commits.includes(step.commit),
            ),
          };
        }

        return nowArticle;
      });
    },
  }),
};

export default collection;
