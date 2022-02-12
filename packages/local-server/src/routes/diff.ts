import { Router } from 'express';
import { readDiff, readFileAtCommit } from '../utils';

const router = Router();

router.get('/', async (req, res) => {
  const commit = req.query.commit as string;
  const file = req.query.file as string;

  if (!commit || !file) {
    return res.sendStatus(400);
  }

  const diff = await readDiff(commit);
  const fd = diff.filter((f) => f.to === file)[0];

  const data = {
    code: fd.deleted ? '' : await readFileAtCommit(commit, file),
    originalCode: fd.new ? '' : await readFileAtCommit(`${commit}~1`, file),
  };

  res.json(data);
});

export default router;
