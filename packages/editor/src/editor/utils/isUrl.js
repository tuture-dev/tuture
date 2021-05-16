export default function isUrl(text) {
  try {
    new URL(text);
    return true;
  } catch (err) {
    return false;
  }
}
