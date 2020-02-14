function StepFileList() {
  return (
    <div>
      {['index.js', 'index.html', 'index.css'].map((item) => (
        <p key={item}>{item}</p>
      ))}
    </div>
  );
}

export default StepFileList;
