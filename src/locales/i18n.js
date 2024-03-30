'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEn from './langs/en.json';
import translationBg from './langs/bg.json';

import commonBg from './langs/bg/common.json';
import formsBg from './langs/bg/forms.json';
import validationBg from './langs/bg/validation.json';
import messagesBg from './langs/bg/messages.json';
import headersBg from './langs/bg/headers.json';
import authBg from './langs/bg/auth.json';
import ecommerceBg from './langs/bg/ecommerce.json';
import campaignBg from './langs/bg/campaign.json';
import helpBg from './langs/bg/help.json';
import profileBg from './langs/bg/profile.json';
import postBg from './langs/bg/post.json';
import locationBg from './langs/bg/location.json';
import homeBg from './langs/bg/home.json';
import dashboardBg from './langs/bg/dashboard.json';

// ----------------------------------------------------------------------

export default async function initTranslations(locale, i18nInstance) {
  i18nInstance = i18nInstance || i18n.createInstance();

  i18nInstance.use(LanguageDetector);
  i18nInstance.use(initReactI18next);

  await i18nInstance.init({
    lng: locale,
    resources: {
      en: { translations: translationEn },
      bg: {
        translations: translationBg,
        validation: validationBg,
        forms: formsBg,
        messages: messagesBg,
        common: commonBg,
        headers: headersBg,
        auth: authBg,
        ecommerce: ecommerceBg,
        campaign: campaignBg,
        help: helpBg,
        profile: profileBg,
        post: postBg,
        location: locationBg,
        home: homeBg,
        dashboard: dashboardBg
      }
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
