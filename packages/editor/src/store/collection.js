export const namespaced = true;

export const state = () => ({
  meta: {
    name: '',
    description: '',
    id: '',
    created: '',
    topics: [],
    categories: [],
  },
  articles: [],
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
  setArticles(state, articles) {
    state.articles = articles;
  },
  setEditArticleId(state, articleId) {
    state.editArticleId = articleId;
  },
};

export const getters = {
  getFirstArticle: (state) => state.articles[0],
  getArticleById: (state) => (articleId) =>
    state.articles.filter((article) => article.id === articleId)[0],
};
