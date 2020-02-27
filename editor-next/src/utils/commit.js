export function isCommitEqual(commit1, commit2) {
  if (!commit1 || !commit2) {
    return false;
  }
  return (
    String(commit1).startsWith(String(commit2)) ||
    String(commit2).startsWith(String(commit1))
  );
}
