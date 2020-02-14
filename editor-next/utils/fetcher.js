export default function fetcher(url) {
  /* global fetch */
  /* eslint no-undef: "error" */
  return fetch(url).then((r) => r.json());
}
