'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { localStorageGetItem } from 'src/utils/storage-available';

import { defaultLang } from './config-lang';
import translationEn from './langs/en.json';
import translationBg from './langs/bg.json';

// ----------------------------------------------------------------------

export default async function initTranslations(locale, i18nInstance) {
  i18nInstance = i18nInstance || i18n.createInstance();

  i18nInstance.use(initReactI18next);

  await i18nInstance.init({
    lng: locale,
    resources: {
      en: { translations: translationEn },
      bg: { translations: translationBg }
    },
    fallbackLng: locale,
    debug: false,
    ns: ['translations'],
    defaultNS: 'translations',
    interpolation: {
      escapeValue: false,
    },
  });

  return {
    i18n: i18nInstance,
    t: i18nInstance.t
  }
}

// const lng = localStorageGetItem('i18nextLng', defaultLang.value);

// i18n
//   .use(LanguageDetector)
//   .use(initReactI18next)
//   .init({
//     resources: {
//       en: { translations: translationEn },
//       bg: { translations: translationBg }
//     },
//     lng,
//     fallbackLng: lng,
//     debug: false,
//     ns: ['translations'],
//     defaultNS: 'translations',
//     interpolation: {
//       escapeValue: false,
//     },
//   });

// export default i18n;
