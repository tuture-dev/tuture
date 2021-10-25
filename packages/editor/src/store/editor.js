export const namespaced = true;

export const state = () => ({
  nowArticleId: '',
  doc: { type: 'doc', content: [] },
  docLoading: false,
});

export const mutations = {
  setNowArticleId(state, articleId) {
    state.nowArticleId = articleId;
  },
  setDoc(state, doc) {
    state.doc = doc;
  },
  setDocLoading(state, loading) {
    state.docLoading = loading;
  },
};

export const actions = {
  async fetchDoc({ commit, state, rootGetters }) {
    // try to initialize nowArticleId whenever collection is ready
    const nowArticleId =
      state.nowArticleId || rootGetters['collection/getFirstArticle'].id;
    if (!nowArticleId) return;
    if (nowArticleId !== state.nowArticleId) {
      commit('setNowArticleId', nowArticleId);
    }

    commit('setDocLoading', true);
    const resp = await fetch(`/api/articles/${state.nowArticleId}`);
    commit('setDoc', await resp.json());
    commit('setDocLoading', false);
  },
};
