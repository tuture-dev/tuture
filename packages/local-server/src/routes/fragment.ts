import { Router } from 'express';
import { flattenSteps, unflattenSteps, isCommitEqual } from '@tuture/core';
import TaskQueue from '../utils/task-queue';

export function createFragmentRouter(queue: TaskQueue) {
  const router = Router();

  router.get('/', (req, res) => {
    const { articleId } = req.query;
    const { steps } = queue.readCollection();

    let fragment;

    if (articleId) {
      fragment = flattenSteps(
        steps.filter((step) => step.articleId === articleId),
      );
    } else {
      fragment = flattenSteps(steps);
    }

    res.json(fragment);
  });

  router.put('/', (req, res) => {
    const fragment = req.body;
    const updatedSteps = unflattenSteps(fragment);

    queue.addTask((c) => {
      const { steps } = c;
      return {
        ...c,
        steps: steps.map(
          (step) =>
            updatedSteps.filter((node) =>
              isCommitEqual(node.commit, step.commit),
            )[0] || step,
        ),
      };
    });

    res.json({ success: true });
  });

  return router;
}
