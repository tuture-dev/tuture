import React from 'react';
import { Slicer, SelectorCreator, Parameterizer } from '@rematch/select';
import { message, notification, Button, Icon } from 'antd';
import { Node } from 'editure';
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
import { Dispatch, RootState } from '../store';
import { TocItem, TocStepItem } from '../types';
import { Collection, Remote, Step, Article } from '../../../types';

export type CollectionState = {
  collection: Collection | null;
  nowArticleId: string | null;
  editArticleId: string | null;
  nowStepCommit: string | null;
  nowSteps: Node[];
  lastSaved: Date | null;
  saveFailed: boolean;
  outdatedNotificationClicked: boolean;
};

const initialState: CollectionState = {
  collection: null,
  nowArticleId: null,
  editArticleId: '',
  nowStepCommit: null,
  nowSteps: [{ type: F.PARAGRAPH, children: [{ text: '' }] }],
  lastSaved: null,
  saveFailed: false,
  outdatedNotificationClicked: false,
};

function updateNowSteps(state: CollectionState) {
  if (!state.collection) return state;

  const { steps } = state.collection;

  if (state.nowArticleId) {
    state.nowSteps = flatten(
      steps.filter((step) => step.articleId === state.nowArticleId),
    );
  } else {
    state.nowSteps = flatten(steps);
  }
}

export const collection = {
  state: initialState,
  reducers: {
    setCollectionData(state: CollectionState, collection: Collection) {
      state.collection = collection;

      if (collection.articles?.length > 0 && !state.nowArticleId) {
        state.nowArticleId = collection.articles[0].id;
      }

      updateNowSteps(state);

      return state;
    },
    setNowArticle(state: CollectionState, articleId: string) {
      state.nowArticleId = articleId;

      if (articleId && state.collection) {
        state.nowStepCommit = state.collection.steps.filter(
          ({ articleId }) => articleId === articleId,
        )[0].commit;
      }

      if (!state.collection) {
        return state;
      }

      updateNowSteps(state);

      return state;
    },
    setArticleTitle(state: CollectionState, title: string) {
      if (!state.collection) return state;

      if (state.collection.articles.length !== 0) {
        state.collection.articles = state.collection.articles.map((article) => {
          if (article.id === state.nowArticleId) {
            article.name = title;
            return article;
          }
          return article;
        });
      } else {
        state.collection.name = title;
      }

      return state;
    },
    setArticleDescription(state: CollectionState, description: string) {
      if (!state.collection) return state;

      if (state.collection.articles.length !== 0) {
        state.collection.articles = state.collection.articles.map((article) => {
          if (article.id === state.nowArticleId) {
            article.description = description;
            return article;
          }
          return article;
        });
      } else {
        state.collection.description = description;
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

      return state;
    },
    switchFile(
      state: CollectionState,
      payload: { removedIndex: number; addedIndex: number; commit: string },
    ) {
      if (!state.collection) return state;

      const { removedIndex, addedIndex, commit } = payload;
      const unflattenedNowSteps = unflatten(state.nowSteps);

      unflattenedNowSteps.forEach((step) => {
        if (isCommitEqual(step.commit, commit)) {
          const oldFile = step.children[removedIndex + 2];
          step.children.splice(removedIndex + 2, 1);
          step.children.splice(addedIndex + 2, 0, oldFile);
        }
      });

      updateNowSteps(state);

      return state;
    },
    setNowSteps(state: CollectionState, fragment: Node[]) {
      state.nowSteps = fragment;
      return state;
    },
    saveNowStepsToCollection(state: CollectionState) {
      if (!state.collection) return state;

      state.collection.steps = state.collection.steps.map(
        (step) =>
          unflatten(state.nowSteps).filter((node) =>
            isCommitEqual(node.commit, step.commit),
          )[0] || step,
      );

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

      state.nowSteps = flatten(unflattenedNowSteps);

      return state;
    },
    setRemotes(state: CollectionState, remotes: Remote[]) {
      if (!state.collection) return state;
      state.collection.remotes = remotes;
      return state;
    },
    setEditArticleId(state: CollectionState, articleId: string) {
      state.editArticleId = articleId;
      return state;
    },
    editArticle(state: CollectionState, payload: Article) {
      if (!state.collection) return state;

      const { editArticleId } = state;

      state.collection.articles = state.collection.articles.map((article) =>
        article.id === editArticleId ? { ...article, ...payload } : article,
      );

      return state;
    },
    createArticle(state: CollectionState, props: Partial<Article>) {
      if (!state.collection) return state;

      const id = shortid.generate();
      const created = new Date();
      state.collection.articles.push({ id, created, ...props } as Article);

      return state;
    },
    setStepById(
      state: CollectionState,
      payload: { stepId: string; stepProps: Partial<Step> },
    ) {
      if (!state.collection) return state;

      const { stepId, stepProps } = payload;

      state.collection.steps = state.collection.steps.map((step) =>
        step.id === stepId ? { ...step, ...stepProps } : step,
      );

      updateNowSteps(state);

      return state;
    },
    editCollection(state: CollectionState, props: Partial<Collection>) {
      if (!state.collection) return state;
      state.collection = { ...state.collection, ...props };
      return state;
    },
    deleteArticle(state: CollectionState, articleId: string) {
      if (!state.collection) return state;

      state.collection.articles = state.collection.articles.filter(
        (article) => article.id !== articleId,
      );
      state.collection.steps = state.collection.steps.map((step) => {
        if (step?.articleId === articleId) {
          step = omit(step, ['articleId']) as Step;
        }
        return step;
      });

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
    updateSteps(state: CollectionState, steps: Step[]) {
      if (!state.collection) return state;
      state.collection.steps = steps;
      return state;
    },
    updateArticles(state: CollectionState, articles: Article[]) {
      if (!state.collection) return state;
      state.collection.articles = articles;
      return state;
    },
    setOutdatedNotificationClicked(state: CollectionState, payload: boolean) {
      state.outdatedNotificationClicked = payload;
      return state;
    },
    deleteStep(state: CollectionState, stepId: string) {
      if (!state.collection) return state;

      state.collection.steps = state.collection.steps.filter(
        (step) => step.id !== stepId,
      );

      return state;
    },
  },
  effects: (dispatch: Dispatch) => ({
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
      const key: string = `open${Date.now()}`;
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
        const data: Collection = await response.json();

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
    async saveCollection(
      payload: { showMessage?: boolean },
      rootState: RootState,
    ) {
      // Ensure nowSteps are merged into collection data.
      dispatch.collection.saveNowStepsToCollection();

      const collectionData = rootState.collection.collection;
      if (!collectionData) return;

      try {
        const response = await fetch('/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(collectionData),
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
  selectors: (
    slice: Slicer<CollectionState>,
    createSelector: SelectorCreator,
    hasProps: Parameterizer<CollectionState>,
  ) => ({
    nowArticleMeta() {
      return slice((collectionState: CollectionState): Article | {} => {
        if (!collectionState.collection) {
          return {};
        }

        const {
          collection: { articles },
          nowArticleId,
        } = collectionState;

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
        if (!collectionState.collection) {
          return [];
        }

        const {
          collection: { steps = [] },
          nowArticleId,
        } = collectionState;

        let finalSteps = nowArticleId
          ? steps.filter((step) => step.articleId === nowArticleId)
          : steps;

        return getHeadings(finalSteps);
      });
    },
    collectionMeta() {
      return slice((collectionState: CollectionState) => {
        const { name, cover, description, topics } =
          collectionState?.collection || {};

        return { name, cover, description, topics };
      });
    },
    getArticleMetaById: hasProps((__: any, props: { id: string }) => {
      return slice((collectionState: CollectionState) => {
        const { id } = props;
        if (!collectionState.collection) {
          return {};
        }

        const { articles, name, description, topics, cover } =
          collectionState?.collection || {};

        if (id) {
          return articles.filter((elem) => elem.id === id)[0];
        }

        return { name, description, topics, cover };
      });
    }),
    getStepFileListAndTitle: hasProps((__: any, props: { commit: string }) => {
      return slice((collectionState: CollectionState) => {
        if (!collectionState.collection) {
          return { fileList: [], title: '' };
        }

        const { commit } = props;

        let flag = '';
        let title = '';
        let fileList: { file: string; display: boolean }[] = [];
        collectionState.nowSteps.forEach((node) => {
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
      return slice((collectionState: CollectionState) => {
        const articles = collectionState.collection?.articles || [];
        const steps = collectionState.collection?.steps || [];

        const articleStepList: TocItem[] = articles.reduce(
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
          [] as TocItem[],
        );

        return articleStepList;
      });
    },
    getUnassignedStepList() {
      return slice((collectionState: CollectionState): TocStepItem[] => {
        if (!collectionState.collection?.steps) {
          return [];
        }

        const { steps } = collectionState.collection;
        const unassignedStepList = collectionState.collection?.steps
          .filter((step) => !step?.articleId)
          .map((step) => ({
            id: step.id,
            outdated: step?.outdated,
            level: 1,
            number: getNumFromStepId(step.id, steps),
            name: getStepTitle(step),
          }));

        return unassignedStepList;
      });
    },
  }),
};
