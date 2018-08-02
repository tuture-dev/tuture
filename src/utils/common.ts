function handleAnchor(origin: string) {
  return origin.toLowerCase().replace(/ /g, '-');
}

export { handleAnchor };
