/**
 * Generate a random hex number.
 */
export function randHex(digits: number = 8) {
  return Math.random()
    .toString(16)
    .slice(2, digits + 2);
}

/**
 * Compare if two commit hash is equal.
 */
export function isCommitEqual(
  commit1?: string | null,
  commit2?: string | null,
) {
  if (!commit1 || !commit2) {
    return false;
  }
  return (
    commit1.startsWith(String(commit2)) || commit2.startsWith(String(commit1))
  );
}

/**
 * Find if the commit is included in an array of commits.
 * @param haystack an array of commits
 * @param needle the commit to include
 * @returns whether the haystack includes the needle (commit)
 */
export function includeCommit(haystack: string[], needle: string): boolean {
  for (let commit of haystack) {
    if (isCommitEqual(commit, needle)) {
      return true;
    }
  }
  return false;
}
