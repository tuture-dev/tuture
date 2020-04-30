import { Slicer, SelectorCreator, Parameterizer } from '@rematch/select';
import { message } from 'antd';
import { Node } from 'editure';
import * as F from 'editure-constants';
import {
  Remote,
  Meta,
  Step,
  Article,
  randHex,
  getHeadings,
  isCommitEqual,
  flattenSteps as flatten,
  unflattenSteps as unflatten,
} from '@tuture/core';

import {
  FILE,
  DIFF_BLOCK,
  STEP,
  NOW_STEP_START,
  STEP_END,
} from '../utils/constants';
import { saveData } from '../utils/request';
import { Dispatch, RootState } from '../store';

export type CollectionState = {
  meta: Meta | null;
  articles: Article[];
  nowArticleId: string | null;
  editArticleId: string | null;
  nowStepCommit: string | null;
  fragment: Node[];
  remotes: Remote[];
  lastSaved: Date | null;
  saveFailed: boolean;
  outdatedNotificationClicked: boolean;
};

export type SaveKey = 'meta' | 'articles' | 'fragment' | 'remotes';

const initialState: CollectionState = {
  meta: null,
  articles: [],
  nowArticleId: null,
  editArticleId: '',
  nowStepCommit: null,
  fragment: [{ type: F.PARAGRAPH, children: [{ text: '' }] }],
  remotes: [],
  lastSaved: null,
  saveFailed: false,
  outdatedNotificationClicked: false,
};

export const collection = {
  state: initialState,
  reducers: {
    setMeta(state: CollectionState, props: Partial<Meta>) {
      state.meta = { ...state.meta, ...props } as Meta;
      return state;
    },
    setArticles(state: CollectionState, articles: Article[]) {
      state.articles = articles;
      return state;
    },
    setNowArticle(state: CollectionState, articleId: string) {
      state.nowArticleId = articleId;

      if (articleId) {
        state.nowStepCommit = state.fragment.filter(
          (step) => step.articleId === articleId,
        )[0]?.commit;
      }

      return state;
    },
    setArticleById(
      state: CollectionState,
      payload: { articleId?: string; props: Partial<Article> },
    ) {
      const { articleId = state.nowArticleId, props } = payload;

      if (state.articles.length > 0) {
        state.articles = state.articles.map((article) => {
          if (article.id === articleId) {
            return { ...article, ...props };
          }
          return article;
        });
      }

      return state;
    },
    setDiffItemHiddenLines(
      state: CollectionState,
      payload: {
        file: string;
        commit: string;
        hiddenLines: [number, number][];
      },
    ) {
      const { file, commit, hiddenLines } = payload;

      for (const node of state.fragment) {
        if (
          node.type === DIFF_BLOCK &&
          node.file === file &&
          isCommitEqual(node.commit, commit)
        ) {
          node.hiddenLines = hiddenLines;
          break;
        }
      }

      return state;
    },
    switchFile(
      state: CollectionState,
      payload: { removedIndex: number; addedIndex: number; commit: string },
    ) {
      const { removedIndex, addedIndex, commit } = payload;
      const steps = unflatten(state.fragment);

      steps.forEach((step) => {
        if (isCommitEqual(step.commit, commit)) {
          const oldFile = step.children[removedIndex + 2];
          step.children.splice(removedIndex + 2, 1);
          step.children.splice(addedIndex + 2, 0, oldFile);
        }
      });

      state.fragment = flatten(steps);

      return state;
    },
    setFragment(state: CollectionState, fragment: Node[]) {
      state.fragment = fragment;
      return state;
    },
    setNowStepCommit(state: CollectionState, commit: string) {
      state.nowStepCommit = commit;
      return state;
    },
    setFileShowStatus(
      state: CollectionState,
      payload: { commit: string; file: string; display: boolean },
    ) {
      let steps = unflatten(state.fragment);

      steps = steps.map((step) => {
        if (isCommitEqual(step.commit, payload.commit)) {
          step.children.map((node) => {
            if (node.type === FILE && node?.file === payload.file) {
              node.display = payload.display;
            }
            return node;
          });
        }

        return step;
      });

      state.fragment = flatten(steps);

      return state;
    },
    setRemotes(state: CollectionState, remotes: Remote[]) {
      state.remotes = remotes;
      return state;
    },
    setEditArticleId(state: CollectionState, articleId: string) {
      state.editArticleId = articleId;
      return state;
    },
    editArticle(state: CollectionState, payload: Article) {
      const { editArticleId } = state;

      state.articles = state.articles.map((article) =>
        article.id === editArticleId ? { ...article, ...payload } : article,
      );

      return state;
    },
    createArticle(state: CollectionState, props: Partial<Article>) {
      const id = randHex(8);
      const created = new Date();
      state.articles.push({ id, created, ...props } as Article);

      return state;
    },
    setStepById(
      state: CollectionState,
      payload: { stepId: string; stepProps: Partial<Step> },
    ) {
      const { stepId, stepProps } = payload;

      state.fragment = state.fragment.map((node) =>
        node.type === 'step' && node.id === stepId
          ? { ...node, ...stepProps }
          : node,
      );

      return state;
    },
    setLastSaved(state: CollectionState, date: Date) {
      state.lastSaved = date;
      return state;
    },
    setSaveFailed(state: CollectionState, failed: boolean) {
      state.saveFailed = failed;
      return state;
    },
    setOutdatedNotificationClicked(state: CollectionState, payload: boolean) {
      state.outdatedNotificationClicked = payload;
      return state;
    },
  },
  effects: (dispatch: Dispatch) => ({
    async fetchMeta() {
      const response = await fetch('/meta');
      const data: Meta = await response.json();

      dispatch.collection.setMeta(data);
    },
    async fetchArticles(_?: any, rootState?: RootState) {
      const response = await fetch('/articles');
      const data: Article[] = await response.json();

      dispatch.collection.setArticles(data);

      const { nowArticleId } = (rootState as RootState).collection;
      if (!nowArticleId) {
        dispatch.collection.setNowArticle(data[0].id);
      }
    },
    async fetchFragment(_?: any, rootState?: RootState) {
      const { nowArticleId } = (rootState as RootState).collection;

      let url = '/fragment';
      if (nowArticleId) {
        url = url + `?articleId=${nowArticleId}`;
      }

      const response = await fetch(url);
      const data: Node[] = await response.json();

      dispatch.collection.setFragment(data);
    },
    async fetchRemotes() {
      const response = await fetch('/remotes');
      const data: Remote[] = await response.json();

      dispatch.collection.setRemotes(data);
    },
    async save(
      payload: {
        keys?: SaveKey[];
        showMessage?: boolean;
      },
      rootState: RootState,
    ) {
      const {
        keys = ['meta', 'articles', 'fragment', 'remotes'],
        showMessage,
      } = payload || {};

      let success: boolean = false;

      // NOTE: We intentionally save data sequentially to avoid race conditions.
      if (keys.includes('meta')) {
        const { meta } = rootState.collection;
        if (meta) {
          success = await saveData(meta, '/meta');
        }
      }
      if (keys.includes('articles')) {
        const { articles } = rootState.collection;
        if (articles) {
          success = await saveData(articles, '/articles');
        }
      }
      if (keys.includes('fragment')) {
        const { fragment } = rootState.collection;
        if (fragment) {
          success = await saveData(fragment, '/fragment');
        }
      }
      if (keys.includes('remotes')) {
        const { remotes } = rootState.collection;
        if (remotes) {
          success = await saveData(remotes, '/remotes');
        }
      }

      if (showMessage) {
        success
          ? message.success('保存内容成功！')
          : message.error('保存内容失败！');
      }

      dispatch.collection.setLastSaved(new Date());
      dispatch.collection.setSaveFailed(!success);
    },
    async deleteArticle(articleId: string) {
      const response = await fetch(`/articles/${articleId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Update collection data.
        await dispatch.collection.fetchArticles();
        await dispatch.collection.fetchFragment();
      }
    },
  }),
  selectors: (
    slice: Slicer<CollectionState>,
    createSelector: SelectorCreator,
    hasProps: Parameterizer<CollectionState>,
  ) => ({
    nowArticleMeta() {
      return slice((collectionState: CollectionState): Article | {} => {
        const { articles, nowArticleId } = collectionState;

        if (nowArticleId) {
          return articles.filter(
            (elem) => elem.id.toString() === nowArticleId.toString(),
          )[0];
        }

        return {};
      });
    },
    nowArticleCatalogue() {
      return slice((collectionState: CollectionState) => {
        return getHeadings(collectionState.fragment);
      });
    },
    getArticleMetaById: hasProps((__: any, props: { id: string }) => {
      return slice((collectionState: CollectionState) => {
        const { id } = props;
        const { articles, meta } = collectionState || {};

        return id ? articles.filter((elem) => elem.id === id)[0] : meta;
      });
    }),
    getStepFileListAndTitle: hasProps((__: any, props: { commit: string }) => {
      return slice((collectionState: CollectionState) => {
        const { commit } = props;

        let flag = '';
        let title = '';
        let fileList: { file: string; display: boolean }[] = [];

        collectionState.fragment.forEach((node) => {
          switch (node.type) {
            case STEP: {
              if (isCommitEqual(node.commit, commit)) {
                flag = NOW_STEP_START;
              }

              break;
            }

            case FILE: {
              if (flag === NOW_STEP_START) {
                fileList.push({ file: node.file, display: node?.display });
              }

              break;
            }

            case F.H2: {
              if (flag === NOW_STEP_START) {
                title = node.children[0].text;
              }

              break;
            }

            case STEP_END: {
              flag = '';

              break;
            }

            default: {
              break;
            }
          }
        });

        return { fileList, title };
      });
    }),
  }),
};
