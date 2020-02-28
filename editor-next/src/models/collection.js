import { message } from 'antd';
import * as F from 'editure-constants';
import shortid from 'shortid';
import pick from 'lodash.pick';
import omit from 'lodash.omit';

import { FILE } from '../utils/constants';
import {
  flatten,
  unflatten,
  getHeadings,
  getStepTitle,
  getNumFromStepId,
} from '../utils/collection';
import { isCommitEqual } from '../utils/commit';

const collection = {
  state: {
    collection: null,
    nowArticleId: null,
    nowStepCommit: null,
    lastSaved: null,
    saveFailed: false,
    editArticleId: '',
  },
  reducers: {
    setCollectionData(state, payload) {
      state.collection = payload;

      if (payload.articles?.length > 0 && !state.nowArticleId) {
        state.nowArticleId = payload.articles[0].id;
      }

      return state;
    },
    setNowArticle(state, payload) {
      state.nowArticleId = payload;

      // May set nowArticleId to null
      if (payload && state.collection) {
        state.nowStepCommit = state.collection.steps.filter(
          ({ articleId }) => articleId === payload,
        )[0];
      }

      return state;
    },
    setArticleTitle(state, payload) {
      if (state.collection.articles.length !== 0) {
        state.collection.articles = state.collection.articles.map((article) => {
          if (article.id === state.nowArticleId) {
            article.name = payload;

            return article;
          }

          return article;
        });
      } else {
        state.collection.name = payload;
      }

      return state;
    },
    setArticleDescription(state, payload) {
      if (state.collection.articles.length !== 0) {
        state.collection.articles = state.collection.articles.map((article) => {
          if (article.id === state.nowArticleId) {
            article.description = payload;

            return article;
          }

          return article;
        });
      } else {
        state.collection.description = payload;
      }

      return state;
    },
    setDiffItemHiddenLines(state, payload) {
      const { file, commit, hiddenLines } = payload;

      for (const step of state.collection.steps) {
        if (isCommitEqual(step.commit, commit)) {
          for (const childNode of step.children) {
            if (childNode.type === FILE && childNode.file === file) {
              childNode.children[1].hiddenLines = hiddenLines;
              break;
            }
          }

          break;
        }
      }

      return state;
    },
    switchFile(state, payload) {
      const { removedIndex, addedIndex, commit } = payload;

      state.collection.steps = state.collection.steps.map((step) => {
        if (isCommitEqual(step.commit, commit)) {
          const oldFile = step.children[removedIndex + 2];
          step.children.splice(removedIndex + 2, 1);
          step.children.splice(addedIndex + 2, 0, oldFile);
        }

        return step;
      });
    },
    setArticleContent(state, payload) {
      const { fragment } = payload;

      if (!fragment) return state;

      const newSteps = unflatten(fragment);

      state.collection.steps = state.collection.steps.map(
        (step) =>
          newSteps.filter((node) =>
            isCommitEqual(node.commit, step.commit),
          )[0] || step,
      );

      return state;
    },
    setNowStepCommit(state, payload) {
      if (payload.commit) {
        state.nowStepCommit = payload.commit;
      }
      return state;
    },
    setFileShowStatus(state, payload) {
      state.collection.steps = state.collection.steps.map((step) => {
        if (isCommitEqual(step.commit, payload.commit)) {
          step.children = step.children.map((file) => {
            if (file.file === payload.file) {
              file.display = payload.display;
            }

            return file;
          });
        }

        return step;
      });

      return state;
    },
    setEditArticleId(state, payload) {
      state.editArticleId = payload;

      return state;
    },
    editArticle(state, payload) {
      const { editArticleId } = state;

      state.collection.articles = state.collection.articles.map((article) =>
        article.id === editArticleId ? { ...article, ...payload } : article,
      );

      return state;
    },
    createArticle(state, payload) {
      const id = shortid.generate();

      state.collection.articles.push({ id, ...payload });

      return state;
    },
    setStepById(state, payload) {
      const { stepId, stepProps } = payload;

      state.collection.steps = state.collection.steps.map((step) =>
        step.id === stepId ? { ...step, ...stepProps } : step,
      );

      return state;
    },
    editCollection(state, payload) {
      state.collection = { ...state.collection, ...payload };

      return state;
    },
    deleteArticle(state, payload) {
      state.collection.articles = state.collection.articles.filter(
        (article) => article.id !== payload,
      );
      state.collection.steps = state.collection.steps.map((step) => {
        if (step?.articleId === payload) {
          step = omit(step, ['articleId']);
        }

        return step;
      });

      return state;
    },
    setLastSaved(state, payload) {
      state.lastSaved = payload;
      return state;
    },
    setSaveFailed(state, payload) {
      state.saveFailed = payload;
      return state;
    },
    updateSteps(state, payload) {
      state.collection.steps = payload;
    },
    updateArticles(state, payload) {
      state.collection.articles = payload;
    },
  },
  effects: (dispatch) => ({
    async editArticle() {
      message.success('保存成功');
      dispatch.drawer.setChildrenVisible(false);
    },
    async createArticle() {
      message.success('创建成功');
      dispatch.drawer.setChildrenVisible(false);
    },
    async editCollection() {
      message.success('保存成功');
      dispatch.drawer.setVisible(false);
    },
    async fetchCollection() {
      try {
        const response = await fetch('/collection');
        const data = await response.json();

        dispatch.collection.setCollectionData(data);
      } catch {
        message.error('获取数据失败！');
      }
    },
    async saveCollection(payload, rootState) {
      try {
        const response = await fetch('/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(rootState.collection.collection),
        });

        if (response.ok) {
          dispatch.collection.setLastSaved(new Date());
          if (payload?.showMessage) {
            message.success('保存内容成功！');
          }
        } else {
          dispatch.collection.setSaveFailed(true);
        }
      } catch (err) {
        dispatch.collection.setSaveFailed(true);
      }
    },
    async commit(payload) {
      const response = await fetch('/commit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          message: payload,
        }),
      });

      if (response.ok) {
        message.success('提交成功！');
      } else {
        message.error('提交失败！');
      }

      dispatch.commit.reset();
    },
  }),
  selectors: (slice, createSelector, hasProps) => ({
    nowArticleMeta() {
      return slice((collectionModel) => {
        if (!collectionModel.collection) {
          return {};
        }

        const {
          collection: { articles },
          nowArticleId,
        } = collectionModel;

        if (nowArticleId) {
          return articles.filter(
            (elem) => elem.id.toString() === nowArticleId.toString(),
          )[0];
        }

        return {};
      });
    },
    nowArticleContent() {
      return slice((collectionModel) => {
        if (!collectionModel.collection) {
          return [{ type: F.PARAGRAPH, children: [{ text: '' }] }];
        }

        const {
          collection: { steps },
          nowArticleId,
        } = collectionModel;

        if (nowArticleId) {
          return flatten(
            steps.filter(({ articleId }) => articleId === nowArticleId),
          );
        }

        return flatten(steps);
      });
    },
    nowArticleCatalogue() {
      return slice((collectionModel) => {
        if (!collectionModel.collection) {
          return [];
        }

        const {
          collection: { steps },
          nowArticleId,
        } = collectionModel;

        if (nowArticleId) {
          return getHeadings(
            steps.filter(({ articleId }) => articleId === nowArticleId),
          );
        }

        return getHeadings(steps);
      });
    },
    collectionMeta() {
      return slice((collectionModel) => {
        const {
          collection: { name, cover, description, topics },
        } = collectionModel;

        return { name, cover, description, topics };
      });
    },
    getArticleMetaById: hasProps((__, props) => {
      return slice((collectionModel) => {
        const { id } = props;
        if (!collectionModel.collection) {
          return {};
        }

        const {
          collection: { articles, name, description, topics, cover },
        } = collectionModel;

        if (id) {
          return articles.filter((elem) => elem.id === id)[0];
        }

        return { name, description, topics, cover };
      });
    }),
    getStepFileListAndTitle: hasProps((__, props) => {
      return slice((collectionModel) => {
        if (!collectionModel.collection) {
          return { fileList: [], title: '' };
        }

        const { commit } = props;
        const nowStep = collectionModel.collection.steps.filter((step) =>
          isCommitEqual(step.commit, commit),
        )[0];

        if (nowStep) {
          const fileList = nowStep.children
            .filter(({ type }) => type === FILE)
            .map(({ file, display = false }) => ({ file, display }));
          const title = getStepTitle(nowStep);
          return { fileList, title };
        }

        return { fileList: [], title: '' };
      });
    }),
    getArticleStepList() {
      return slice((collectionModel) => {
        const articles = collectionModel.collection?.articles || [];
        const steps = collectionModel.collection?.steps || [];

        const articleStepList = articles.reduce(
          (initialArticleStepList, nowArticle) => {
            const articleItem = {
              ...pick(nowArticle, ['id', 'name']),
              level: 0,
            };
            const stepList = steps
              .filter((step) => step?.articleId === nowArticle.id)
              .map((step) => ({
                ...pick(step, ['id', 'articleId']),
                level: 1,
                number: getNumFromStepId(step.id, steps),
                name: getStepTitle(step),
              }));

            return initialArticleStepList.concat(articleItem, ...stepList);
          },
          [],
        );

        return articleStepList;
      });
    },
    getUnassignedStepList() {
      return slice((collectionModel) => {
        const steps = collectionModel.collection?.steps || [];
        const unassignedStepList = steps
          .filter((step) => !step?.articleId)
          .map((step) => ({
            id: step.id,
            level: 1,
            number: getNumFromStepId(step.id, steps),
            name: getStepTitle(step),
          }));

        return unassignedStepList;
      });
    },
  }),
};

export default collection;
