function handleAnchor(origin: string) {
  return origin.toLowerCase().replace(/ /g, '-');
}

function isClientOrServer() {
  return typeof window !== 'undefined' && window.document ? 'client' : 'server';
}

export { handleAnchor, isClientOrServer };
