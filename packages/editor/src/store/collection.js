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
  articles: [],
  editArticleId: '',
  nowStepCommit: null,
  remotes: [],
  lastSaved: null,
  saveFailed: false,
  outdatedNotificationClicked: false,
  articles: [
    {
      id: '1',
      name: 'Hail Tuture',
      created: '',
      topics: ['vue_1', 'vuex_1'],
      categories: ['前端_1'],
    },
    {
      id: '2',
      name: 'Tuture is Back!!',
      created: '',
      topics: ['vue_2', 'vuex_2'],
      categories: ['前端_2'],
    },
  ],
});

export const mutations = {
  setMeta(state, meta) {
    state.meta = meta;
  },
  setArticles(state, articles) {
    state.articles = articles;
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
  getFirstArticle: (state) => state.articles[0],
  getArticleById: (state) => (articleId) =>
    state.articles.filter((article) => article.id === articleId)[0],
};
