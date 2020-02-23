import * as F from 'editure-constants';
import shortid from 'shortid';
import { message } from 'antd';

import { FILE, STEP } from '../utils/constants';
import diff from '../utils/data/diff.json';
import tuture from '../utils/data/converted-tuture.json';

function flatten(steps) {
  return steps.flatMap(({ commit, id, children }) => [
    { commit, id, type: STEP, children: [{ text: '' }] },
    ...children.flatMap((node) => {
      if (node.type === FILE && node.display) {
        const { file } = node;
        return [
          { file, type: FILE, children: [{ text: '' }] },
          ...node.children,
        ];
      }
      return node;
    }),
  ]);
}

function unflatten(fragment) {
  const steps = [{ ...fragment[0], children: [] }];

  for (let i = 1; i < fragment.length; i++) {
    const node = fragment[i];
    if (node.type === STEP) {
      steps.push({ ...node, children: [] });
    } else if (node.type === FILE && node.display) {
      steps
        .slice(-1)[0]
        .children.push({ ...node, children: fragment.slice(i + 1, i + 4) });
      i += 3;
    } else {
      steps.slice(-1)[0].children.push(node);
    }
  }

  return steps;
}

function isHeading(node) {
  return [F.H1, F.H2, F.H3, F.H4, F.H5].includes(node.type);
}

function getHeadingText(node) {
  return node.children.map((child) => child.text).join('');
}

function getHeadings(nodes) {
  return nodes.flatMap((node) => {
    if (isHeading(node)) {
      return { ...node, title: getHeadingText(node) };
    }
    if (node.children) {
      return getHeadings(node.children);
    }
    return [];
  });
}

const collection = {
  state: {
    diff,
    collection: tuture,
    nowArticleId: tuture.articles[0].id,
    nowStepCommit: '372a021',
    editArticleId: '',
  },
  reducers: {
    setCollectionData(state, payload) {
      state.diff = payload.diff;
      state.collection = { ...state.collection, ...payload.tuture };
      state.nowStepCommit = payload.tuture.steps[0].commit;

      if (state.collection.articles?.length > 0) {
        state.nowArticleId = state.collection.articles[0].id;
        state.nowStepCommit = state.collection.articles[0].commits.slice(-1)[0];
      }

      return state;
    },
    setNowArticle(state, payload) {
      state.nowArticleId = payload;
      state.nowStepCommit = state.collection.articles
        .filter((article) => article.id === payload)[0]
        .commits.slice(-1)[0];

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
    setStepTitle(state, payload) {
      const { commit, value } = payload;

      state.collection.steps = state.collection.steps.map((step) => {
        if (step.commit === commit) {
          step.name = value;

          return step;
        }

        return step;
      });

      return state;
    },
    setDiffItemHiddenLines(state, payload) {
      const { file, commit, hiddenLines } = payload;

      state.collection.steps = state.collection.steps.map((step) => {
        if (step.commit === commit) {
          step.children = step.children.map((diffFile) => {
            if (diffFile.file === file) {
              diffFile.hiddenLines = hiddenLines;
            }

            return diffFile;
          });
        }

        return step;
      });

      return state;
    },
    switchFile(state, payload) {
      const { removedIndex, addedIndex, commit } = payload;

      state.collection.steps = state.collection.steps.map((step) => {
        if (step.commit === commit) {
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
          newSteps.filter((node) => node.commit === step.commit)[0] || step,
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
        if (step.commit === payload.commit) {
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

      state.collection.articles = state.collection.articles.map((article) => {
        if (article.id === editArticleId) {
          article = { ...article, ...payload };
        }

        return article;
      });

      const { commits = [] } = payload;
      state.collection.steps = state.collection.steps.map((step) => {
        if (commits.includes(step.commit)) {
          step.isSelected = true;
        }

        return step;
      });

      return state;
    },
    createArticle(state, payload) {
      const id = shortid.generate();

      state.collection.articles.push({
        id,
        ...payload,
      });

      const { commits } = payload;
      state.collection.steps = state.collection.steps.map((step) => {
        if (commits.includes(step.commit)) {
          step.isSelected = true;
        }

        return step;
      });

      return state;
    },
    releaseCommits(state, payload) {
      const needReleasedCommits = payload;

      state.collection.steps = state.collection.steps.map((step) => {
        if (needReleasedCommits.includes(step.commit)) {
          step.isSelected = false;
        }

        return step;
      });

      return state;
    },
    editCollection(state, payload) {
      state.collection = { ...state.collection, ...payload };

      return state;
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
  }),
  selectors: (slice, createSelector, hasProps) => ({
    nowArticleMeta: hasProps((__, props) => {
      return slice((collectionModel) => {
        const { nowArticleId } = props;
        const {
          collection: { articles, name, description, tags, cover },
        } = collectionModel;

        if (nowArticleId) {
          return articles.filter((elem) => elem.id === nowArticleId)[0];
        }

        return { name, description, tags, cover };
      });
    }),
    nowArticleContent() {
      return slice((collectionModel) => {
        const {
          collection: { articles, steps },
          nowArticleId,
        } = collectionModel;

        if (nowArticleId) {
          const article = articles.filter(
            (elem) => elem.id.toString() === nowArticleId.toString(),
          )[0];
          return flatten(
            steps.filter((step) => article.commits.includes(step.commit)),
          );
        }

        return flatten(steps);
      });
    },
    nowArticleCatalogue() {
      return slice((collectionModel) => {
        const {
          collection: { articles, steps },
          nowArticleId,
        } = collectionModel;

        if (nowArticleId) {
          const article = articles.filter(
            (elem) => elem.id.toString() === nowArticleId.toString(),
          )[0];
          return getHeadings(
            steps.filter((step) => article.commits.includes(step.commit)),
          );
        }

        return getHeadings(steps);
      });
    },
    collectionMeta() {
      return slice((collectionModel) => {
        const {
          collection: { name, cover, description, tags },
        } = collectionModel;

        return { name, cover, description, tags };
      });
    },
    getDiffItemByCommitAndFile: hasProps((__, props) => {
      return slice(
        (collectionModel) =>
          collectionModel.diff
            .filter((diffItem) => diffItem.commit === props.commit)[0]
            .diff.filter((diffItem) => diffItem.to === props.file)[0],
      );
    }),
    getStepFileListAndTitle: hasProps((__, props) => {
      return slice((collectionModel) => {
        const { commit } = props;
        const nowStep = collectionModel.collection.steps.filter(
          (step) => step.commit === commit,
        )[0];

        if (nowStep) {
          const fileList = nowStep.children
            .filter(({ type }) => type === FILE)
            .map(({ file, display = true }) => ({ file, display }));
          return {
            fileList,
            title: getHeadings([nowStep])
              .flat(5)
              .filter((node) => node.commit)[0].title,
          };
        }

        return { fileList: [], title: '' };
      });
    }),
    getCollectionCatalogue() {
      return slice((collectionModel) => {
        const getCommitName = (commit) => {
          const steps = collectionModel.collection.steps.filter(
            (step) => step.commit === commit,
          );

          return getHeadings(steps)
            .flat(5)
            .filter((node) => node.commit)[0].title;
        };

        const getCommitArrName = (commitArr) => {
          const commitArrWithName = commitArr.map((commit) => ({
            commit,
            name: getCommitName(commit),
          }));

          return commitArrWithName;
        };

        const { articles = [] } = collectionModel.collection;

        const collectionCatalogue = articles.map((article) => ({
          ...article,
          commitArrWithName: getCommitArrName(article.commits),
        }));

        return collectionCatalogue;
      });
    },
    getAllCommits() {
      return slice((collectionModel) => {
        const commits = collectionModel.collection.steps.map((step, index) => ({
          commit: step?.commit,
          name: getHeadings([step])[0].title,
          isSelected: step?.isSelected,
          key: index,
        }));

        return commits;
      });
    },
    getNowArticleCommits: hasProps((__, props) => {
      return slice((collectionModel) => {
        const { nowArticleId } = props;

        const {
          collection: { articles, steps },
        } = collectionModel;

        const article = articles.filter(
          (elem) => elem.id.toString() === nowArticleId.toString(),
        )[0];

        if (!article) {
          return [];
        }

        let nowArticleSteps = [];

        steps.map((step, index) => {
          if (article.commits.includes(step.commit)) {
            nowArticleSteps.push({ ...step, key: index });
          }
        });

        const commits = nowArticleSteps.map((step) => ({
          commit: step?.commit,
          name: getHeadings([step])[0].title,
          isSelected: step?.isSelected,
          key: step.key,
        }));

        return commits;
      });
    }),
  }),
};

export default collection;
