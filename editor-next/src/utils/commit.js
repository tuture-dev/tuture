export function isCommitEqual(commit1, commit2) {
  if (!commit1 || !commit2) {
    return false;
  }
  return commit1.startsWith(commit2) || commit2.startsWith(commit1);
}
