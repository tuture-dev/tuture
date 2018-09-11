import i18n from 'i18next';
import Backend from 'i18next-node-fs-backend';
import { LanguageDetector } from 'i18next-express-middleware';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .init({
    // we init with resources
    resources: {
      en: {
        translations: {
          tagTitle: 'This tutoria contains:',
          deleteButton: 'Delete',
          editButton: 'Edit',
          editTab: 'Edit',
          previewTab: 'Preview',
          cancelButton: 'Cancel',
          SaveButton: 'Save',
          fillStepIntroduction: 'Fill the introduction of this step',
          fillStepExplain: 'Fill the explain of this step',
          fillFileIntrodution: 'Fill the introduction of this file',
          fillFileExplain: 'Fill the explain of this file',
        },
      },
      'zh-CN': {
        translations: {
          tagTitle: '本篇教程涉及的内容：',
        },
      },
    },
    fallbackLng: 'en',
    debug: true,

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
