import { getNodeText } from '@tuture/core';

export const namespaced = true;

export const state = () => ({
  nowArticleId: '',
  doc: { type: 'doc', content: [] },
});

export const mutations = {
  setNowArticleId(state, articleId) {
    state.nowArticleId = articleId;
  },
  setDoc(state, doc) {
    state.doc = doc;
  },
};

const convertNodeToHeading = (node) => ({
  target: node.attrs.id,
  title: getNodeText(node),
  level: node.attrs.level,
});

export const getters = {
  getHeadings: (state) =>
    state.doc.content
      .filter((node) => node.type === 'heading' || node.type === 'explain')
      .flatMap((node) =>
        node.type === 'heading'
          ? convertNodeToHeading(node)
          : node.content
              .filter((node) => node.type === 'heading')
              .map(convertNodeToHeading),
      ),
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
  },
};
