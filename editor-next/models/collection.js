/**
 *  interface File {
 *    file: string;
 *    display: boolean;
 *    explain: {
 *      pre: string;
 *      post: string;
 *      }
 *  }
 *
 *
 *  interface Step {
 *    name: string;
 *    commit: string;
 *    diff: Array<File>;
 *    explain: {
 *      pre: string;
 *      post: string;
 *    }
 *  }
 *
 * interface Article {
 *   name: string;
 *   id: string;
 *   topics: Array<string>;
 *   categories: Array<string>;
 *   description: string;
 *   steps: Array<Step>
 * }
 *
 *
 * interface Collection {
 *   name: string;
 *   id: string;
 *   topics: Array<string>;
 *   categories: Array<string>;
 *   description: string;
 *   articles: Array<Article>;
 * }
 *
 */

const collection = {
  state: {
    tuture: {},
    diff: [],
    collection: {
      articles: [],
    },
    nowArticle: {},
  },
  reducers: {
    // handle stagetCollectionDatate changes with pure functions
    setCollectionData(state, payload) {
      const { tuture, diff } = payload;
      state.tuture = tuture;
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

      if (state.collection.articles.length !== 0) {
        state.collection.articles = state.collection.articles.map((article) => {
          if (article.id === state.nowArticle.id) {
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
  },
};

export default collection;
