import Commit from './Commit';

function PageBody() {
  return (
    <div>
      PageBody
      {['commit1', 'commit2', 'commit3'].map((commit) => (
        <Commit commit={commit} key={commit} />
      ))}
    </div>
  );
}

export default PageBody;
