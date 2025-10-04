import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 1. Update import paths to match your folder names
import translationEN from './locales/english/translation.json';
import translationHI from './locales/hindi/translation.json';
import translationML from './locales/malayalam/translation.json';

// 2. Update the keys in the resources object
const resources = {
  english: {
    translation: translationEN,
  },
  hindi: {
    translation: translationHI,
  },
  malayalam: {
    translation: translationML,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    // 3. Update the language keys here as well
    supportedLngs: ['english', 'hindi', 'malayalam'],
    fallbackLng: 'english',
    debug: true,
    react: {
      useSuspense: false,
    },
  });

export default i18n;