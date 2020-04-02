export function isCommitEqual(commit1: string, commit2: string) {
  if (!commit1 || !commit2) {
    return false;
  }
  return (
    commit1.startsWith(String(commit2)) || commit2.startsWith(String(commit1))
  );
}

export function timeout<T>(ms: number, promise: Promise<T>) {
  return new Promise<T>(function(resolve, reject) {
    setTimeout(function() {
      reject(new Error('timeout'));
    }, ms);
    promise.then(resolve, reject);
  });
}
