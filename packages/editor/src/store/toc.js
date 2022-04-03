export const namespaced = true;

export const state = () => ({
  tocVisible: false,
  tocLoading: false,
  tocSaving: false,
  tocData: {},
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
  setTocData(state, data) {
    state.tocData = data;
  }
};

export const actions = {
  async fetchToc({ commit }, { collectionId }) {
    commit('setTocLoading', true);
    // const resp = await fetch(`/api/toc/${collectionId}`);
    // const { unassignedStepList, articleStepList } = await resp.json();
    const res = { "articles": [{ "id": "7c96a2d538c91", "name": "My Awesome Tutorial" }], "articleCommitMap": { "7c96a2d538c91": [{ "commit": "3dbe38f203a621c4a0ba7ff10c223fc90f004f9a", "articleId": "7c96a2d538c91", "id": "786f8709", "level": 2, "name": "first commit" }, { "commit": "b4b56b084bd2341107370e0fe7907c3810ef713f", "articleId": "7c96a2d538c91", "id": "e7623c55", "level": 2, "name": "second commit" }] }, "commitFileMap": { "3dbe38f203a621c4a0ba7ff10c223fc90f004f9a": [{ "file": "a.js" }], "b4b56b084bd2341107370e0fe7907c3810ef713f": [{ "file": "a.js" }] } }
    commit('setTocData', res);
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
};
