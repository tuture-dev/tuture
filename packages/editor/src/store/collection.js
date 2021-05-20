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
      topics: ['vue', 'vuex'],
      categories: ['前端'],
    },
    {
      id: '2',
      name: 'Tuture is Back!!',
      created: '',
      topics: ['vue', 'vuex'],
      categories: ['前端'],
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
  addArticles(state, article) {
    state.articles.push(article);
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
