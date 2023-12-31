import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './translations/en';
import es from './translations/es';
import LanguageDetector from 'i18next-browser-languagedetector';
import pt from './translations/pt';
import ja from './translations/ja';

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    resources: {
      en: en,
      es: es,
      pt: pt,
      ja: ja,
    },
    supportedLngs: ['en', 'es', 'pt', 'ja'],
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  });
