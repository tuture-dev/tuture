export const namespaced = true;

export const state = () => ({
  tocVisible: false,
  tocLoading: false,
  tocSaving: false,
  tocSucceed: false,
  tocError: false,
  tocArticleSteps: {},
  tocStepFiles: {},
});

export const mutations = {
  setTocVisible(state, visible) {
    state.tocVisible = visible;
  },
  setTocLoading(state, loading) {
    state.tocLoading = loading;
  },
  setTocSaving(state, saving) {
    state.tocSaving = saving;
  },
  setTocArticleSteps(state, data) {
    state.tocArticleSteps = data;
  },
  setTocStepFiles(state, data) {
    state.tocStepFiles = data;
  },
  setTocSucceed(state, data) {
    state.tocSucceed = data;
  },
  setError(state, data) {
    state.tocError = data;
  }
};

export const actions = {
  async fetchTocArticleSteps({ commit }, { collectionId }) {
    commit('setTocLoading', true);

    try {
      const resp = await fetch(`/api/toc/articles?collectionId=${collectionId}`);
      const data = await resp.json();

      commit('setTocSucceed', true)
      commit('setTocArticleSteps', data)
    } catch (err) {
      commit('setTocError', true);
    }

    commit('setTocLoading', false);
  },
  async fetchTocStepFiles({ commit }, { collectionId, articleId, stepId }) {
    commit('setTocLoading', true);

    try {
      const resp = await fetch(`/api/toc/steps?collectionId=${collectionId}&articleId=${articleId}&stepId=${stepId}`);
      const data = await resp.json();

      commit('setTocSucceed', true)
      commit('setTocStepFiles', data)
    } catch (err) {
      commit('setTocError', true);
    }

    commit('setTocLoading', false);
  },
  async saveToc({ state, commit }) {
    commit('setTocSaving', true);
    await fetch('/api/toc', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        articleStepList: state.articleSteps,
        unassignedStepList: state.releasedSteps,
      }),
    });
    commit('setTocSaving', false);
    commit('setTocVisible', false);
  },
  async fetchStepRearrange({ commit }, { articleModifySteps }) {
    commit('setTocLoading', true);

    try {
      // 这里是在服务端通过修改 ydoc 的方式，然后通过 WebSocket 自动同步到本端或者其他客户端
      await fetch('fetchStepRearrange', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articleModifySteps,
        })
      })

      commit('setTocSucceed', true)
    } catch (err) {
      console.log('err', err);
      commit('setTocError', true)
    }
  },
  async fetchFileRearrange({ commit }, payload) {
    commit('setTocLoading', true);

    try {
      // 这里是在服务端通过修改 ydoc 的方式，然后通过 WebSocket 自动同步到本端或者其他客户端
      await fetch('fetchFileRearrange', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...payload,
        })
      })

      commit('setTocSucceed', true)
    } catch (err) {
      console.log('err', err);
      commit('setTocError', true)
    }
  },
};
