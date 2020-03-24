export function flattenHiddenLines(rangeGroups) {
  return rangeGroups.flatMap((range) => {
    const [start, end] = range;
    return [...Array(end - start + 1).keys()].map((elem) => elem + start);
  });
}

export function unflattenHiddenLines(hiddenLines) {
  const rangeGroups = [];
  let startNumber = null;

  for (let i = 0; i < hiddenLines.length; i++) {
    const prev = hiddenLines[i - 1];
    const current = hiddenLines[i];
    const next = hiddenLines[i + 1];

    if (current !== prev + 1 && current !== next - 1) {
      rangeGroups.push([current, current]);
    } else if (current !== prev + 1) {
      startNumber = hiddenLines[i];
    } else if (current + 1 !== next) {
      rangeGroups.push([startNumber, hiddenLines[i]]);
    }
  }

  return rangeGroups;
}
