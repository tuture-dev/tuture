const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const morgan = require('morgan');
const omit = require('lodash.omit');
const pick = require('lodash.pick');
const {
  flattenSteps,
  unflattenSteps,
  getStepTitle,
  isCommitEqual,
  getHeadings,
} = require('@tuture/core');

const app = express();
const mockRoot = path.join('src', 'utils', 'data');
const collectionPath = path.join(mockRoot, 'collection.json');
const diffPath = path.join(mockRoot, 'diff.json');

const diff = JSON.parse(fs.readFileSync(diffPath));
const collection = JSON.parse(fs.readFileSync(collectionPath));

function saveCollection() {
  fs.writeFileSync(collectionPath, JSON.stringify(collection, null, 2));
}

function getCollectionMeta() {
  return pick(collection, [
    'name',
    'description',
    'id',
    'created',
    'topics',
    'categories',
    'github',
  ]);
}

function getArticleIdFromId(items, stepId) {
  const item = items.filter((item) => item.id === stepId)[0];
  return item.articleId;
}

app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));

app.get('/diff', (_, res) => {
  res.json(diff);
});

app.get('/meta', (_, res) => {
  res.json(getCollectionMeta(collection));
});

app.put('/meta', (req, res) => {
  Object.entries(req.body).forEach((entry) => {
    const [key, value] = entry;
    collection[key] = value;
  });

  saveCollection();

  res.json(getCollectionMeta(collection));
});

app.get('/articles', (_, res) => {
  res.json(collection.articles);
});

app.put('/articles', (req, res) => {
  collection.articles = req.body;
  saveCollection();

  res.json(collection.articles);
});

app.get('/articles/:articleId', (req, res) => {
  const { articleId } = req.params;
  const article = collection.articles.filter(({ id }) => articleId === id);
  res.json(article);
});

app.delete('/articles/:articleId', (req, res) => {
  const { articleId } = req.params;

  collection.articles = collection.articles.filter(
    (article) => article.id !== articleId,
  );
  collection.steps = collection.steps.map((step) => {
    if (step.articleId === articleId) {
      step = omit(step, ['articleId']);
    }
    return step;
  });

  saveCollection();

  res.json({ success: true });
});

app.get('/fragment', (req, res) => {
  const { articleId } = req.query;

  let fragment;

  if (articleId) {
    fragment = flattenSteps(
      collection.steps.filter((step) => step.articleId === articleId),
    );
  } else {
    fragment = flattenSteps(collection.steps);
  }

  res.json(fragment);
});

app.put('/fragment', (req, res) => {
  const fragment = req.body;
  const updatedSteps = unflattenSteps(fragment);

  collection.steps = collection.steps.map(
    (step) =>
      updatedSteps.filter((node) =>
        isCommitEqual(node.commit, step.commit),
      )[0] || step,
  );

  saveCollection();

  res.json({ success: true });
});

app.get('/collection-steps', (_, res) => {
  const { steps, articles } = collection;

  const getArticleIndexAndName = (articleId = '', articles = []) => {
    let targetArticleIndex = 0;
    const targetArticle = articles.filter((article, index) => {
      if (article.id === articleId) {
        targetArticleIndex = index;
        return true;
      }
      return false;
    })[0];

    return {
      articleIndex: targetArticleIndex,
      articleName: targetArticle.name || '',
    };
  };

  const collectionSteps = steps.map((step, index) => ({
    key: String(index),
    id: step.id,
    articleId: step.articleId,
    title: getHeadings([step])[0].title,
    ...getArticleIndexAndName(step.articleId || '', articles),
  }));

  res.json(collectionSteps);
});

app.get('/toc', (_, res) => {
  const { articles = [], steps = [] } = collection;

  const articleStepList = articles.reduce(
    (initialArticleStepList, nowArticle) => {
      const articleItem = {
        ...pick(nowArticle, ['id', 'name']),
        level: 0,
      };
      const stepList = steps
        .filter((step) => step.articleId === nowArticle.id)
        .map((step) => ({
          ...pick(step, ['id', 'articleId', 'outdated']),
          level: 1,
          number: steps.findIndex(({ id }) => step.id === id),
          name: getStepTitle(step),
        }));

      return initialArticleStepList.concat(articleItem, ...stepList);
    },
    [],
  );

  const unassignedStepList = collection.steps
    .filter((step) => !step.articleId)
    .map((step) => ({
      id: step.id,
      outdated: step.outdated,
      level: 1,
      number: steps.findIndex(({ id }) => step.id === id),
      name: getStepTitle(step),
    }));

  res.json({ articleStepList, unassignedStepList });
});

app.put('/toc', (req, res) => {
  const {
    articleStepList,
    unassignedStepList,
    needDeleteOutdatedStepList,
  } = req.body;

  let { steps, articles } = collection;

  // handle article deletion
  const nowArticleIdList = articleStepList
    .filter((item) => !item.articleId)
    .map((item) => item.id);
  collection.articles = articles.filter((article) =>
    nowArticleIdList.includes(article.id),
  );

  // handle step allocation
  const nowAllocationStepList = articleStepList.filter(
    (item) => item.articleId,
  );
  const nowAllocationStepIdList = nowAllocationStepList.map((item) => item.id);

  steps = steps.map((step) => {
    if (nowAllocationStepIdList.includes(step.id)) {
      step.articleId = getArticleIdFromId(nowAllocationStepList, step.id);
    }
    return step;
  });

  const unassignedStepIdList = unassignedStepList.map((step) => step.id);
  steps = steps.map((step) => {
    if (unassignedStepIdList.includes(step.id)) {
      step = omit(step, ['articleId']);
    }
    return step;
  });

  // delete outdated deleted step
  steps = steps.filter((step) => !needDeleteOutdatedStepList.includes(step.id));

  collection.steps = steps;
  saveCollection();

  res.json({ success: true });
});

app.get('/remotes', (_, res) => {
  res.json([
    {
      name: 'origin',
      refs: {
        fetch: 'https://github.com/tuture-dev/tuture.git',
        push: 'https://github.com/tuture-dev/tuture.git',
      },
    },
    {
      name: 'gitlab',
      refs: {
        fetch: 'https://gitlab.com/tuture-dev/tuture.git',
        push: 'https://gitlab.com/tuture-dev/tuture.git',
      },
    },
    {
      name: 'coding',
      refs: {
        fetch: 'https://e.coding.net/tuture-dev/tuture.git',
        push: 'https://e.coding.net/tuture-dev/tuture.git',
      },
    },
  ]);
});

app.put('/remotes', (req, res) => {
  collection.remotes = req.body;
  saveCollection();

  res.json(collection.remotes);
});

app.get('/sync', (req, res) => {
  setTimeout(() => {
    res.sendStatus(500);
  }, 2000);
});

app.listen(8000, () => {
  console.log('API server is running!');
});
