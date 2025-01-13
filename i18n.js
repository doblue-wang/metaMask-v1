// src/i18n.js
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './public/locales/en/common.json';  // 英文翻译
import zhTranslation from './public/locales/zh/common.json';  // 中文翻译

i18next
  .use(initReactI18next) // 初始化 i18next
  .init({
    resources: {
      en: { translation: enTranslation },
      zh: { translation: zhTranslation },
    },
    lng: 'en', // 默认语言
    fallbackLng: 'en', // 后备语言
    interpolation: {
      escapeValue: false, // XSS 安全
    },
  });

export default i18next;

  