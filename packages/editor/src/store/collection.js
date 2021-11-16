export const namespaced = true;

export const state = () => ({
  meta: {
    name: '',
    cover: '',
    description: '',
    id: '',
    created: '',
    topics: [],
    categories: [],
  },
  metaLoading: false,
  articles: [],
  articlesLoading: false,
  editArticleId: '',
  nowStepCommit: null,
  remotes: [],
  lastSaved: null,
  saveFailed: false,
  outdatedNotificationClicked: false,
});

export const mutations = {
  setMeta(state, meta) {
    state.meta = meta;
  },
  setMetaLoading(state, loading) {
    state.metaLoading = loading;
  },
  setArticles(state, articles) {
    state.articles = articles || [];
  },
  setArticlesLoading(state, loading) {
    state.articlesLoading = loading;
  },
  addArticle(state, article) {
    state.articles.push(article);
  },
  modifyArticle(state, article) {
    state.articles.forEach((item) => {
      if (item.id === state.editArticleId) {
        item = article;
      }
    });
  },
  setEditArticleId(state, articleId) {
    state.editArticleId = articleId;
  },
};

export const getters = {
  getFirstArticle: (state) => state.articles[0] || {},
  getArticleById: (state) => (articleId) =>
    state.articles.filter((article) => article.id === articleId)[0] || {},
};

export const actions = {
  async fetchMeta({ commit }) {
    commit('setMetaLoading', true);
    const resp = await fetch(`/api/meta`);
    commit('setMeta', await resp.json());
    commit('setMetaLoading', false);
  },
  async fetchArticles({ commit, rootState, getters }) {
    commit('setArticlesLoading', true);
    const resp = await fetch(`/api/articles`);
    commit('setArticles', await resp.json());
    commit('setArticlesLoading', false);

    // try to initialize nowArticleId whenever collection is ready
    if (!rootState.editor.nowArticleId) {
      commit('editor/setNowArticleId', getters['getFirstArticle'].id, {
        root: true,
      });
    }
  },
};
