import { Language, Translations } from '../types';

const translations: Record<Language, Translations> = {
  ru: {
    errors: {
      emptyItem: 'Пожалуйста, введите название продукта',
    },
    alerts: {
      error: 'Ошибка',
    },
  },
  en: {
    errors: {
      emptyItem: 'Please enter a product name',
    },
    alerts: {
      error: 'Error',
    },
  },
};

export const getTranslation = (language: Language): Translations => translations[language]; 