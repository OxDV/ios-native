import { Language, Translations } from '../types';

const translations: Record<Language, Translations> = {
  ru: {
    errors: {
      emptyItem: 'Пожалуйста, введите название продукта',
      aiError: 'Ошибка при получении ингредиентов. Попробуйте еще раз',
    },
    alerts: {
      error: 'Ошибка',
      loading: 'Загрузка',
    },
    messages: {
      loadingIngredients: 'Получаем список ингредиентов...',
    },
  },
  en: {
    errors: {
      emptyItem: 'Please enter a product name',
      aiError: 'Error getting ingredients. Please try again',
    },
    alerts: {
      error: 'Error',
      loading: 'Loading',
    },
    messages: {
      loadingIngredients: 'Getting ingredients list...',
    },
  },
};

export const getTranslation = (language: Language): Translations => translations[language]; 