import i18n from 'i18next';
import LngDetector from 'i18next-browser-languagedetector';

import resources from './resources';

i18n.use(LngDetector).init({
  resources,
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
