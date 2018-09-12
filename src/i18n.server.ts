import i18n from 'i18next';
import Backend from 'i18next-node-fs-backend';
import { LanguageDetector } from 'i18next-express-middleware';

export const resources = {
  en: {
    translations: {
      tagTitle: 'This tutorial contains:',
      deleteButton: 'Delete',
      editButton: 'Edit',
      editTab: 'Edit',
      previewTab: 'Preview',
      cancelButton: 'Cancel',
      saveButton: 'Save',
      fillStepIntroduction: 'Fill the introduction of this step',
      fillStepExplain: 'Fill the explain of this step',
      fillFileIntrodution: 'Fill the introduction of this file',
      fillFileExplain: 'Fill the explain of this file',
      menu: 'Menu',
      copySuccess: 'Copied',
    },
  },
  'zh-CN': {
    translations: {
      tagTitle: '本篇教程涉及的内容：',
      deleteButton: '删除',
      editButton: '编辑',
      editTab: '编辑',
      previewTab: '预览',
      cancelButton: '取消',
      saveButton: '保存',
      fillStepIntroduction: '填写此步骤的介绍文字',
      fillStepExplain: '填写此步骤的解释文字',
      fillFileIntrodution: '填写此文件的介绍文字',
      fillFileExplain: '填写此文件的解释文字',
      menu: '教程目录',
      copySuccess: '复制成功',
    },
  },
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .init({
    // we init with resources
    resources,
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
