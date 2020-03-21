import React from 'react';
import { message, notification, Button, Icon } from 'antd';
import * as F from 'editure-constants';
import shortid from 'shortid';
import pick from 'lodash.pick';
import omit from 'lodash.omit';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import {
  FILE,
  DIFF_BLOCK,
  STEP,
  NOW_STEP_START,
  STEP_END,
} from '../utils/constants';
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
    nowSteps: [{ type: F.PARAGRAPH, children: [{ text: '' }] }],
    lastSaved: null,
    saveFailed: false,
    editArticleId: '',
    outdatedNotificationClicked: false,
  },
  reducers: {
    setCollectionData(state, payload) {
      state.collection = payload;

      if (payload.articles?.length > 0 && !state.nowArticleId) {
        state.nowArticleId = payload.articles[0].id;
      }

      const { steps } = state.collection;

      if (state.nowArticleId) {
        state.nowSteps = flatten(
          steps.filter((step) => step.articleId === state.nowArticleId),
        );
      } else {
        state.nowSteps = flatten(steps);
      }
    },
    setNowArticle(state, payload) {
      state.nowArticleId = payload;

      // May set nowArticleId to null
      if (payload && state.collection) {
        state.nowStepCommit = state.collection.steps.filter(
          ({ articleId }) => articleId === payload,
        )[0];
      }

      if (!state.collection) {
        return;
      }

      const { steps } = state.collection;

      if (state.nowArticleId) {
        state.nowSteps = flatten(
          steps.filter((step) => step.articleId === state.nowArticleId),
        );
      } else {
        state.nowSteps = flatten(steps);
      }
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
    },
    setDiffItemHiddenLines(state, payload) {
      const { file, commit, hiddenLines } = payload;

      for (const node of state.nowSteps) {
        if (
          node.type === DIFF_BLOCK &&
          node.file === file &&
          isCommitEqual(node.commit, commit)
        ) {
          node.hiddenLines = hiddenLines;
          break;
        }
      }
    },
    switchFile(state, payload) {
      const { removedIndex, addedIndex, commit } = payload;

      const unflattenedNowSteps = unflatten(state.nowSteps);

      unflattenedNowSteps.forEach((step) => {
        if (isCommitEqual(step.commit, commit)) {
          const oldFile = step.children[removedIndex + 2];
          step.children.splice(removedIndex + 2, 1);
          step.children.splice(addedIndex + 2, 0, oldFile);
        }
      });

      const { steps } = state.collection;

      if (state.nowArticleId) {
        state.nowSteps = flatten(unflattenedNowSteps);
      } else {
        state.nowSteps = flatten(steps);
      }
    },
    setNowSteps(state, payload) {
      const { fragment } = payload;

      if (!fragment) return state;

      state.nowSteps = fragment;
    },
    saveNowStepsToCollection(state) {
      state.collection.steps = state.collection.steps.map(
        (step) =>
          unflatten(state.nowSteps).filter((node) =>
            isCommitEqual(node.commit, step.commit),
          )[0] || step,
      );
    },
    setNowStepCommit(state, payload) {
      if (payload.commit) {
        state.nowStepCommit = payload.commit;
      }
    },
    setFileShowStatus(state, payload) {
      let unflattenedNowSteps = unflatten(state.nowSteps);

      unflattenedNowSteps = unflattenedNowSteps.map((step) => {
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

      console.log(flatten(unflattenedNowSteps));

      state.nowSteps = flatten(unflattenedNowSteps);
    },
    setEditArticleId(state, payload) {
      state.editArticleId = payload;
    },
    editArticle(state, payload) {
      const { editArticleId } = state;

      state.collection.articles = state.collection.articles.map((article) =>
        article.id === editArticleId ? { ...article, ...payload } : article,
      );
    },
    createArticle(state, payload) {
      const id = shortid.generate();
      const created = new Date();
      state.collection.articles.push({ id, created, ...payload });
    },
    setStepById(state, payload) {
      const { stepId, stepProps } = payload;

      state.collection.steps = state.collection.steps.map((step) =>
        step.id === stepId ? { ...step, ...stepProps } : step,
      );
    },
    editCollection(state, payload) {
      state.collection = { ...state.collection, ...payload };
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
    },
    setLastSaved(state, payload) {
      state.lastSaved = payload;
    },
    setSaveFailed(state, payload) {
      state.saveFailed = payload;
    },
    updateSteps(state, payload) {
      state.collection.steps = payload;
    },
    updateArticles(state, payload) {
      state.collection.articles = payload;
    },
    setOutdatedNotificationClicked(state, payload) {
      state.outdatedNotificationClicked = payload;
    },
    deleteStep(state, payload) {
      state.collection.steps = state.collection.steps.filter(
        (step) => step.id !== payload,
      );
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
    async openOutdatedNotification() {
      const key = `open${Date.now()}`;
      const btn = (
        <Button
          type="primary"
          size="small"
          onClick={() => notification.close(key)}
        >
          去处理
        </Button>
      );
      const description = (
        <div>
          <p>在你的步骤列表里面存在过时的步骤，请及时迁移内容或删除这些步骤</p>
          <p
            css={css`
              display: flex;
              flex-direction: row;
              align-items: center;
              margin-top: 16px;
            `}
          >
            <Icon
              type="question-circle"
              style={{ color: '#096dd9' }}
              css={css`
                &:hover {
                  cursor: pointer;
                  color: #02b875;
                }
              `}
            />
            <a
              href="https://docs.tuture.co/reference/tuture-yml-spec.html#outdated"
              target="_blank"
              rel="noopener noreferrer"
              css={css`
                margin-left: 4px;
              `}
            >
              什么是过时步骤？
            </a>
          </p>
        </div>
      );
      notification.warning({
        message: '过时步骤提醒',
        description,
        btn,
        key,
        duration: null,
        onClick: () => {
          dispatch.collection.setOutdatedNotificationClicked(true);
        },
      });
    },
    async fetchCollection() {
      try {
        const response = await fetch('/collection');
        const data = await response.json();

        let outdatedExisted = false;

        if (data?.steps && Array.isArray(data?.steps)) {
          const len = data.steps.filter((step) => step.outdated).length;
          outdatedExisted = !!len;
        }

        if (outdatedExisted) {
          dispatch.collection.openOutdatedNotification();
        }

        dispatch.collection.setCollectionData(data);
      } catch {
        message.error('获取数据失败！');
      }
    },
    async saveCollection(payload, rootState) {
      // Ensure nowSteps are merged into collection data.
      dispatch.collection.saveNowStepsToCollection();

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
    nowArticleCatalogue() {
      return slice((collectionModel) => {
        if (!collectionModel.collection) {
          return [];
        }

        const {
          collection: { steps = [] },
          nowArticleId,
        } = collectionModel;

        let finalSteps = nowArticleId
          ? steps.filter((step) => step.articleId === nowArticleId)
          : steps;

        return getHeadings(finalSteps);
      });
    },
    collectionMeta() {
      return slice((collectionModel) => {
        const { name, cover, description, topics } =
          collectionModel?.collection || {};

        return { name, cover, description, topics };
      });
    },
    getArticleMetaById: hasProps((__, props) => {
      return slice((collectionModel) => {
        const { id } = props;
        if (!collectionModel.collection) {
          return {};
        }

        const { articles, name, description, topics, cover } =
          collectionModel?.collection || {};

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

        let flag = '';
        let title = '';
        let fileList = [];
        collectionModel.nowSteps.forEach((node) => {
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
                ...pick(step, ['id', 'articleId', 'outdated']),
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
        if (!collectionModel.collection?.steps) {
          return [];
        }
        const unassignedStepList = collectionModel.collection?.steps
          .filter((step) => !step?.articleId)
          .map((step) => ({
            id: step.id,
            outdated: step?.outdated,
            level: 1,
            number: getNumFromStepId(
              step.id,
              collectionModel.collection?.steps,
            ),
            name: getStepTitle(step),
          }));

        return unassignedStepList;
      });
    },
  }),
};

export default collection;
