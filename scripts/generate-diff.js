const {
  listAllCommits,
  readDiff,
  readFileAtCommit,
} = require('@tuture/local-server');

async function generate() {
  const commits = await listAllCommits();

  const commitDiffProms = commits.map(async ({ hash }) => {
    const files = await readDiff(hash);
    const fileProms = files.map(async (file) => ({
      file: file.to,
      diff: {
        code: file.deleted ? '' : await readFileAtCommit(hash, file.to),
        originalCode: file.new
          ? ''
          : await readFileAtCommit(`${hash}~1`, file.to),
      },
    }));
    const fileDiffs = await Promise.all(fileProms);
    return {
      commit: hash,
      files: fileDiffs,
    };
  });

  return (await Promise.all(commitDiffProms)).reduce(
    (acc, cur) => ({
      ...acc,
      [cur.commit]: cur.files.reduce(
        (accIn, curIn) => ({
          ...accIn,
          [curIn.file]: curIn.diff,
        }),
        {},
      ),
    }),
    {},
  );
}

generate().then((obj) => {
  console.log(JSON.stringify(obj, null, 2));
});
