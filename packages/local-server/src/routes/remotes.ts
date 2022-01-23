import { Router } from 'express';
import simplegit from 'simple-git/promise.js';

import TaskQueue from '../utils/task-queue';

export function createRemotesRouter(queue: TaskQueue) {
  const router = Router();
  const git = simplegit().silent(true);

  router.get('/', (req, res) => {
    const { fromGit = false } = req.query;

    if (fromGit) {
      git
        .getRemotes(true)
        .then((remotes) => res.json(remotes))
        .catch((err) => res.status(500).json(err));
    } else {
      const { remotes } = queue.readCollection();
      res.json(remotes);
    }
  });

  router.put('/', (req, res) => {
    queue.addTask((c) => ({ ...c, remotes: req.body }), 0);
    res.sendStatus(200);
  });

  return router;
}
