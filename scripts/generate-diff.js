const {
  listAllCommits,
  readDiff,
  readFileAtCommit,
} = require('@tuture/local-server');

async function generate() {
  const commits = await listAllCommits();

  const commitDiffProms = commits.map(async ({ hash }) => {
    const commit = hash.slice(0, 7);
    const files = await readDiff(commit);
    const fileProms = files.map(async (file) => ({
      file: file.to,
      diff: {
        code: file.deleted ? '' : await readFileAtCommit(commit, file.to),
        originalCode: file.new
          ? ''
          : await readFileAtCommit(`${commit}~1`, file.to),
      },
    }));
    const fileDiffs = await Promise.all(fileProms);
    return {
      commit: commit,
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
