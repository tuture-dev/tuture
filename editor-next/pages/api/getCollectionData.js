/* eslint-disable import/no-unresolved */
import diff from '../../utils/data/diff.json';
import tuture from '../../utils/data/tuture.json';

export default async (req, res) => {
  res.status(200).json({
    diff,
    tuture,
  });
};
