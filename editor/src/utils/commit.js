export function isCommitEqual(commit1, commit2) {
  if (!commit1 || !commit2) {
    return false;
  }
  return (
    String(commit1).startsWith(String(commit2)) ||
    String(commit2).startsWith(String(commit1))
  );
}

export function timeout(ms, promise) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      reject(new Error('timeout'));
    }, ms);
    promise.then(resolve, reject);
  });
}
