export const namespaced = true;

export const state = () => ({
  meta: null,
  articles: [
    { id: 1, name: 'Hail Tuture' },
    { id: 2, name: 'Tuture is Back!!' },
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
  getArticleById(state, articleId) {
    return (
      state.articles.filter((article) => article.id === Number(articleId))[0] ||
      {}
    );
  },
};
