function CommitFileList() {
  return (
    <div>
      {['index.js', 'index.html', 'index.css'].map((item) => (
        <p>{item}</p>
      ))}
    </div>
  );
}

export default CommitFileList;
