export const namespaced = true;

export const state = () => ({
  meta: null,
  articles: [
    { id: '1', name: 'Hail Tuture' },
    { id: '2', name: 'Tuture is Back!!' },
  ],
  editArticleId: '',
  nowStepCommit: null,
  remotes: [],
  lastSaved: null,
  saveFailed: false,
  outdatedNotificationClicked: false,
});

export const mutations = {
  setEditArticleId(state, articleId) {
    state.editArticleId = articleId;
  },
};

export const getters = {
  getFirstArticle: (state) => state.articles[0],
  getArticleById: (state) => (articleId) =>
    state.articles.filter((article) => article.id === articleId)[0],
};
