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
  },
};

export const actions = {
  async fetchTocArticleSteps({ commit }, { collectionId }) {
    commit('setTocLoading', true);
    console.log('hello');

    try {
      // const resp = await fetch(`/api/toc/articleSteps?collectionId=${collectionId}`);

      // 这里因为服务端 IO 错误，TODO：后续排查，先临时拿最终结果来操作
      // const data = await resp.json();
      const data = {
        res: {
          articles: [{ id: 'ec365f5839d3f', name: 'My Awesome Tutorial' }],
          articleCommitMap: {
            ec365f5839d3f: [
              {
                commit: '340a5ce8255ea4f89f67644f5404879e8208388d',
                articleId: 'ec365f5839d3f',
                id: 'ade772a6',
                level: 2,
                name: 'first commit',
              },
              {
                commit: '362eae41ffb474f69e6e51b89532ae79ad4fc601',
                articleId: 'ec365f5839d3f',
                id: '0441b4f9',
                level: 2,
                name: 'second commit',
              },
            ],
          },
        },
      };

      const resItem = data.res.articles;
      const tocArticleSteps = resItem.map((article) => {
        const steps = data.res.articleCommitMap[article.id];
        article.steps = steps;

        return article;
      });

      commit('setTocSucceed', true);
      commit('setTocArticleSteps', tocArticleSteps);
    } catch (err) {
      commit('setTocError', true);
    }

    commit('setTocLoading', false);
  },
  async fetchTocStepFiles({ commit }, { collectionId, articleId, stepId }) {
    commit('setTocLoading', true);

    try {
      // const resp = await fetch(`/api/toc/stepsFiles?collectionId=${collectionId}&articleId=${articleId}&stepId=${stepId}`);
      // const data = await resp.json();
      const data = {
        '362eae41ffb474f69e6e51b89532ae79ad4fc601': {
          commit: '362eae41ffb474f69e6e51b89532ae79ad4fc601',
          articleId: 'ac6e583be919a',
          id: '1aa9ce7d',
          level: 2,
          name: 'first commit',
          files: [
            {
              file: 'a.js',
              id: '12345',
            },
          ],
        },
      };

      commit('setTocSucceed', true);
      commit('setTocStepFiles', data);
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
        }),
      });

      commit('setTocSucceed', true);
    } catch (err) {
      console.log('err', err);
      commit('setTocError', true);
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
        }),
      });

      commit('setTocSucceed', true);
    } catch (err) {
      console.log('err', err);
      commit('setTocError', true);
    }
  },
};
