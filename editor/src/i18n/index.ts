import i18n from 'i18next';
import LngDetector from 'i18next-browser-languagedetector';

import resources from './resources';

function getLanguage() {
  const lng = navigator.language;
  if (['en', 'en-US', 'zh', 'zh-CN'].includes(lng)) {
    return lng;
  }

  return 'en';
}

const lngDetector = new LngDetector();
lngDetector.addDetector({
  name: 'navigatorDetector',
  lookup() {
    return getLanguage();
  },
  cacheUserLanguage() {
    localStorage.setItem('i18nextLng', getLanguage());
  },
});

i18n.use(lngDetector).init({
  resources,
  detection: { order: ['navigatorDetector'] },
  fallbackLng: 'en',
  debug: process.env.NODE_ENV === 'development',

  // have a common namespace used around the full app
  ns: ['translations'],
  defaultNS: 'translations',

  keySeparator: false, // we use content as keys

  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ',',
  },

  react: {
    wait: true,
  },
});

export default i18n;
