export const IS_MAC =
  typeof window != 'undefined' &&
  /Mac|iPod|iPhone|iPad/.test(window.navigator.platform);

export const IS_FIREFOX =
  typeof navigator !== 'undefined' &&
  /^(?!.*Seamonkey)(?=.*Firefox).*/i.test(navigator.userAgent);
