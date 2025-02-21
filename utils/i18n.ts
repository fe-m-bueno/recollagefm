import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from '../locales/en/translation.json';
import ptBRTranslation from '../locales/pt-br/translation.json';
import esTranslation from '../locales/es/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      pt: { translation: ptBRTranslation },
      es: { translation: esTranslation },
    },
    fallbackLng: 'en',
    debug: false,
    detection: {
      order: ['navigator', 'localStorage', 'sessionStorage', 'htmlTag'],
      caches: ['localStorage', 'sessionStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
