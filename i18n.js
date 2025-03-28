import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

// 引入各语言的翻译文件
import enTranslation from './public/locales/en/common.json';
import zhTranslation from './public/locales/zh/common.json';
import thTranslation from './public/locales/th/common.json';
import jaTranslation from './public/locales/ja/common.json';
import koTranslation from './public/locales/ko/common.json';
import deTranslation from './public/locales/de/common.json';
import esTranslation from './public/locales/es/common.json';
import frTranslation from './public/locales/fr/common.json';
import msTranslation from './public/locales/ms/common.json';
import idTranslation from './public/locales/id/common.json';
import viTranslation from './public/locales/vi/common.json';
import kmTranslation from './public/locales/km/common.json';
import myTranslation from './public/locales/my/common.json';

i18next
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      zh: { translation: zhTranslation },
      th: { translation: thTranslation }, // 泰语
      ja: { translation: jaTranslation }, // 日语
      ko: { translation: koTranslation }, // 韩语
      de: { translation: deTranslation }, // 德语
      es: { translation: esTranslation }, // 西班牙语
      fr: { translation: frTranslation }, // 法语
      ms: { translation: msTranslation }, // 马来语
      id: { translation: idTranslation }, // 印度尼西亚语
      vi: { translation: viTranslation }, // 越南语
      km: { translation: kmTranslation }, // 柬埔寨语（高棉语）
      my: { translation: myTranslation }, // 缅甸语
    },
    lng: "", // 默认语言
    fallbackLng: 'en', // 默认回退到英语
    interpolation: {
      escapeValue: false, // 防止 XSS
    },
  });

export default i18next;
